import assert from "node:assert/strict";
import test from "node:test";
import {mapWeather, phaseFor, fetchEnv} from "../components/experiments/environment.mjs";

test("weather selects appropriate particle behavior, including wind override",()=>{
  assert.deepEqual(mapWeather(0,4),["clear","CLEAR"]);
  assert.deepEqual(mapWeather(3,20),["wind","WINDY"]);
  assert.deepEqual(mapWeather(65,24),["rain","RAIN"]);
  assert.deepEqual(mapWeather(85,4),["snow","SNOW"]);
  assert.deepEqual(mapWeather(99,4),["storm","STORM"]);
  assert.deepEqual(mapWeather(999,0),["clouds","CLOUDY"]);
});
test("day phase boundaries match the canonical environment",()=>{
  assert.deepEqual([4,5,10,11,16,17,20,21,23,0].map(phaseFor),["night","morning","morning","day","day","evening","evening","night","night","night"]);
});
test("weather fetch preserves cancellation, units and timezone",async t=>{
  const abort=new AbortController();
  t.mock.method(globalThis,"fetch",async(url,options)=>{
    assert.equal(options.signal,abort.signal);
    const parsed=new URL(url);
    assert.equal(parsed.searchParams.get("temperature_unit"),null);
    assert.equal(parsed.searchParams.get("current"),"weather_code,wind_speed_10m,wind_direction_10m");
    assert.equal(parsed.searchParams.get("daily"),"sunrise,sunset");
    assert.equal(parsed.searchParams.get("timezone"),"America/New_York");
    return {ok:true,json:async()=>({current:{weather_code:0,wind_speed_10m:4,wind_direction_10m:270},timezone:"America/New_York"})};
  });
  assert.deepEqual(await fetchEnv(40.4406,-79.9959,"America/New_York",abort.signal),{code:"clear",cond:"CLEAR",weatherCode:0,solarDays:[],windDir:270,windSpeed:4,tz:"America/New_York"});
});
test("invalid weather does not display invented measurements",async t=>{
  t.mock.method(globalThis,"fetch",async()=>({ok:true,json:async()=>({current:{}})}));
  await assert.rejects(fetchEnv(0,0,undefined,undefined),/Invalid weather/);
});
test("weather network errors propagate to the unavailable state",async t=>{
  t.mock.method(globalThis,"fetch",async()=>({ok:false,status:503}));
  await assert.rejects(fetchEnv(0,0,undefined,undefined),/weather 503/);
});
