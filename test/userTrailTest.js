import test from 'ava'
import browserEnv from 'browser-env';
import MeasurementFramework from "../lib/MeasurementFramework"
import userTrail from '../lib/userTrail'

browserEnv();


test('foo', t => {
    userTrail();
    MeasurementFramework.init();
});

