import { assert } from "chai";
import { Memoize } from "../src";

describe("Memoize", () => {


    it("Should cast properly an iterable", async () => {
        class TestMock {
            count: number = 0;

            @Memoize
            get value() {
                return ++this.count;
            }
        }

        const instance  = new TestMock();

        assert.equal(instance.value, 1);
        assert.equal(instance.value, 1);
        assert.equal(instance.value, instance.count);
    });

});
