import assert from 'node:assert/strict';
import test from 'node:test';
import { illumination, sampleLightField, windVector, flashInfluence } from '../components/experiments/atmosphere/material.mjs';
import { weatherState, weatherStates, weatherResponse, previewSettings, previewStates, timeLighting, localTime, lightningDelay, lightningEnvelope } from '../components/experiments/atmosphere/model.mjs';

test('raw condition survives wind overrides; Fog and Snow retain future identities', () => {
  const env = { code: 'wind', cond: 'WINDY' };
  for (const [w, state] of [[0,'clear'],[2,'partly-cloudy'],[3,'overcast'],[45,'fog'],[75,'snow'],[65,'rain'],[95,'thunderstorm']]) {
    assert.equal(weatherState({...env, weatherCode:w}), state);
  }
  assert.equal(weatherStates.fog.artDirection, 'reserved');
  assert.equal(weatherStates.snow.artDirection, 'reserved');
  assert.deepEqual(weatherResponse('fog'), weatherResponse('overcast'));
  assert.equal(weatherState({...env, cond:'NO SIGNAL', weatherCode:95}), 'neutral');
});

test('all eight previews isolate weather and time; accelerated lightning is development-only and explicit', () => {
  assert.equal(Object.keys(previewStates).length, 8);
  for (const name of Object.keys(previewStates)) assert.equal(previewSettings('?atmosphere='+name).name, name);
  assert.equal(previewSettings('?atmosphere=unknown'), null);
  assert.equal(previewSettings('?atmosphere=thunderstorm&lightning=qa', false).fastLightning, false);
  assert.equal(previewSettings('?atmosphere=thunderstorm', true).fastLightning, false);
  assert.equal(previewSettings('?atmosphere=thunderstorm&lightning=qa', true).fastLightning, true);
  assert.equal(previewSettings('?atmosphere=rain&hour=0').hour, 0);
});

test('brightest daylight moves spatially over eight seconds with no density or color change', () => {
  const time = timeLighting(12);
  function peak(t) {
    let best = -1, position = 0;
    for (let x=0;x<=1000;x++) {
      const value=illumination(x/1000,.5,t,time);
      if(value>best){best=value;position=x;}
    }
    return position;
  }
  assert.ok(Math.abs(peak(8)-peak(0)) > 100);
});

test('continuous morning, evening and midnight transitions remain bounded without hard switches', () => {
  for(let h=0;h<24;h+=.025){
    const a=timeLighting(h), b=timeLighting(h+.0001);
    for(const key of Object.keys(a)) assert.ok(Math.abs(a[key]-b[key])<.001);
    assert.ok(Math.abs(a.day+a.night-1)<1e-10);
  }
  assert.ok(timeLighting(6.6).warm>0);
  assert.ok(timeLighting(18.75).warm>.8);
  assert.equal(timeLighting(0).night,1);
  assert.deepEqual(timeLighting(24),timeLighting(0));
});

test('local solar timing uses the selected location date, timezone and fractional hour', () => {
  const t=localTime({tz:'America/New_York',solarDays:[{date:'2026-09-08',sunrise:'2026-09-08T06:52',sunset:'2026-09-08T19:42'}]},new Date('2026-09-08T22:30:30Z'));
  assert.ok(Math.abs(t.hour-18.5083333)<.00001);
  assert.ok(Math.abs(t.sunrise-(6+52/60))<.00001);
  assert.equal(t.approximate,false);
});

test('weather filters the same continuous illumination, retaining wind-driven change at night', () => {
  const clear=weatherResponse('clear'), rain=weatherResponse('rain');
  for(const hour of [0,6.5,12,18.75]){
    const time=timeLighting(hour);
    for(let u=0;u<=1;u+=.1){
      const a=sampleLightField(u,.4,1440,900,0,0,0,clear,time,41);
      const b=sampleLightField(u,.4,1440,900,0,0,0,rain,time,41);
      const near=sampleLightField(u+.00001,.4,1440,900,0,0,0,rain,time,41);
      assert.ok(a.direct>b.direct);assert.ok(a.diffusion<b.diffusion);
      assert.ok(Math.abs(b.direct-near.direct)<.001);
    }
  }
  const wind=windVector(8,270), time=timeLighting(0);
  // A point inside a dense cloud can stay saturated while its boundary travels.
  let densityChange=0;
  for(let u=0;u<=1;u+=.05) for(let v=0;v<=.5;v+=.05){
    const a=sampleLightField(u,v,1440,900,0,0,0,rain,time,41);
    const b=sampleLightField(u,v,1440,900,wind.x*8,wind.y*8,8,rain,time,41);
    densityChange+=Math.abs(a.density-b.density);
  }
  assert.ok(densityChange>1);
  assert.ok(windVector(10,90).x<0);assert.ok(windVector(10,270).x>0);
});

test('lightning timing remains rare in production, spatially directional, and decays', () => {
  for(const random of [0,.2,.5,1]){
    assert.ok(lightningDelay(false,random)>=60 && lightningDelay(false,random)<=180);
    assert.ok(lightningDelay(true,random)>=5 && lightningDelay(true,random)<=12);
  }
  assert.equal(lightningEnvelope(-1),0);
  assert.ok(lightningEnvelope(.15)>.5);
  assert.ok(lightningEnvelope(4,true)<.001);
  assert.ok(flashInfluence(.9,.3,1,41)>flashInfluence(.1,.3,1,41)*20);
});

test('separate cloud bodies advect with the wind without regenerating and retain soft edges', async () => {
  const { cloudLayers } = await import('../components/experiments/atmosphere/material.mjs');
  for (let x=0;x<1440;x+=120) for(let y=0;y<900;y+=60){
    const a=cloudLayers(x,y,900,0,0,41);
    const transported=cloudLayers(x+80,y,900,80,0,41);
    assert.deepEqual(a,transported);
    const near=cloudLayers(x+.001,y+.001,900,0,0,41);
    assert.ok(Math.abs(a.mass-near.mass)<.001);
  }
});

test('stars twinkle gradually at independent intervals, only at night and outside dense cloud', async () => {
  const { starVisibility } = await import('../components/experiments/atmosphere/material.mjs');
  assert.equal(starVisibility(0,0,0,1),0);
  assert.equal(starVisibility(1,1,0,1),0);
  assert.ok(starVisibility(1,.7,0,1)<starVisibility(1,.1,0,1));
  const brightness=[];
  for(let t=0;t<30;t+=.1) {
    const a=starVisibility(1,0,t,1), b=starVisibility(1,0,t+.1,1);
    assert.ok(Math.abs(a-b)<.09);
    brightness.push(a);
  }
  assert.ok(Math.max(...brightness)-Math.min(...brightness)>.7);
  assert.notEqual(starVisibility(1,0,5,1),starVisibility(1,0,5,2));
});

test('clouds have separated silhouettes rather than a continuous bank', async () => {
  const {cloudLayers}=await import('../components/experiments/atmosphere/material.mjs');
  const occupied=new Set();
  for(let y=0;y<90;y++) for(let x=0;x<144;x++) if(cloudLayers(x*10,y*10,900,0,0,41).mass>.2) occupied.add(y*144+x);
  let components=0;
  while(occupied.size){
    components++; const queue=[occupied.values().next().value]; occupied.delete(queue[0]);
    while(queue.length){const n=queue.pop(),x=n%144,y=Math.floor(n/144);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx=x+dx,ny=y+dy,k=ny*144+nx;
        if(nx>=0&&nx<144&&ny>=0&&ny<90&&occupied.delete(k)) queue.push(k);
      }
    }
  }
  assert.equal(components,3);
});

test('rain travels downward with wind and is absent from dry weather responses', async () => {
  const {rainDrop}=await import('../components/experiments/atmosphere/material.mjs');
  const a=rainDrop(1,0,1440,900,25,41),b=rainDrop(1,.1,1440,900,25,41);
  assert.ok(b.y-a.y>20); assert.ok(b.x>a.x);
  for(const state of ['clear','partly-cloudy','overcast','fog','snow','neutral']) assert.equal(weatherResponse(state).precipitation,0);
  assert.ok(weatherResponse('rain').precipitation>0);
  assert.ok(weatherResponse('thunderstorm').precipitation>weatherResponse('rain').precipitation);
});

test('clouds and precipitation stay in the upper window, with gradual rain extinction', async () => {
  const {cloudLayers,rainVisibility}=await import('../components/experiments/atmosphere/material.mjs');
  for(const flow of [0,500,4000,20000]) for(let y=500;y<900;y+=50) for(let x=0;x<1440;x+=80) {
    assert.equal(cloudLayers(x,y,900,flow,flow,41).mass,0);
  }
  assert.ok(rainVisibility(.1)>rainVisibility(.3));
  assert.ok(rainVisibility(.3)>rainVisibility(.45));
  assert.equal(rainVisibility(.5),0);
  for(let v=0;v<1;v+=.001) assert.ok(Math.abs(rainVisibility(v+.001)-rainVisibility(v))<.005);
});

test('sunset traverses distinct upper, middle and lower wavelengths continuously', async () => {
  const {sunsetColor}=await import('../components/experiments/atmosphere/material.mjs');
  const palette={'sunset-top':[163,179,210],'sunset-middle':[242,180,169],'sunset-bottom':[255,226,164]};
  assert.deepEqual(sunsetColor(0,palette),palette['sunset-top']);
  assert.deepEqual(sunsetColor(1,palette),palette['sunset-bottom']);
  assert.ok(sunsetColor(.5,palette)[0]>sunsetColor(.5,palette)[2]);
  for(let v=0;v<1;v+=.01) for(let c=0;c<3;c++) assert.ok(Math.abs(sunsetColor(v+.001,palette)[c]-sunsetColor(v,palette)[c])<1);
});

test('glass retains both clear and diffused regions with bounded refraction', async () => {
  const {glassOptics}=await import('../components/experiments/atmosphere/material.mjs');
  const values=[];
  for(let y=0;y<900;y+=20) for(let x=0;x<1440;x+=20){
    const lens=glassOptics(x,y,41);values.push(lens.diffusion);
    assert.ok(Number.isFinite(lens.dx)&&Math.abs(lens.dx)<=7);
    assert.ok(Number.isFinite(lens.dy)&&Math.abs(lens.dy)<=6);
    assert.ok(lens.diffusion>=.12&&lens.diffusion<=.94);
    assert.deepEqual(glassOptics(x,y,41),lens);
  }
  assert.ok(Math.min(...values)<.25);assert.ok(Math.max(...values)>.85);
  const wind=windVector(8,270);
  assert.ok(wind.x>5&&wind.x<10);
});
