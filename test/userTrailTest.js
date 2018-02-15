import test from 'ava'
import MeasurementFramework from "../lib/MeasurementFramework"
import userTrail from '../lib/userTrail'
import browserEnv from 'browser-env';
browserEnv();


test('foo', t => {
    userTrail();
    MeasurementFramework.init();
});

