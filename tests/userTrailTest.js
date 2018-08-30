import MeasurementFramework, {userTrail} from "../index"
import {greater, incrementEventValue} from "../lib/userTrail"

describe("User Trail Test Script", function () {
    // The 'it' function of Jasmine defined an individual tests. The first argument is
    // a description of the tests that's appended to the module name. Because a module name
    // is typically a noun, like the name of the function being tested, the description for
    // an individual tests is typically written in an action-data format.
    const FIRST_TEST_EVENT = "First Test Event"
    const SECOND_TEST_EVENT = "Second Test Event"

    const test_events = [FIRST_TEST_EVENT, SECOND_TEST_EVENT]
    userTrail(test_events, [
        function () {
            return "Test Funnel Stage"
        },
        function () {
            if (greater(FIRST_TEST_EVENT, 1)) {
                return "Next Level Funnel Stage"
            } else {
                return false;
            }
        }
    ])
    var initial_state = MeasurementFramework.init()

    it("should set initial funnel stage", function () {

        // Check the results; "expect" and toEqual are Jasmine methods.
        expect(initial_state.funnelStage()).toEqual("Test Funnel Stage")
        expect(initial_state.userTrail()).toEqual({
            FirstTestEvent: 0,
            SecondTestEvent: 0
        })
        incrementEventValue(FIRST_TEST_EVENT)
        incrementEventValue(FIRST_TEST_EVENT)
        expect(initial_state.userTrail()).toEqual({
            FirstTestEvent: 2,
            SecondTestEvent: 0
        })
        expect(initial_state.funnelStage()).toEqual("Next Level Funnel Stage")
    })

    it("should not load extra framework code", function () {
        var new_initial_state = MeasurementFramework.init()
        expect(new_initial_state).toEqual(undefined)
    })

    it("should accept changes in events", function () {

    })
})