import assert from "assert";
import { F1Field } from "ffjavascript";
import { print } from "../src/r1cs.js";

describe("r1cs.print", function () {
    const F = new F1Field(17n);
    const symbols = { varIdx2Name: ["one", "x", "y"] };

    function printRow(fields, row) {
        const lines = [];
        print({ ...fields, constraints: [row] }, symbols, { info: line => lines.push(line) });
        return lines;
    }

    it("prints a constraint over a prime field without a curve", function () {
        const row = [{ 1: F.negone }, { 2: F.one }, {}];
        assert.deepStrictEqual(printRow({ F }, row), ["[ -x ] * [ y ] - [  ] = 0"]);
    });

    it("accepts a field supplied through curve.Fr", function () {
        const row = [{ 1: F.one }, { 2: F.one }, {}];
        assert.deepStrictEqual(printRow({ curve: { Fr: F } }, row), ["[ x ] * [ y ] - [  ] = 0"]);
    });

    it("prints the coefficient of wire zero as a constant", function () {
        const row = [{ 0: 2n, 1: F.negone }, { 0: F.neg(2n), 2: F.one }, { 0: F.one }];
        assert.deepStrictEqual(printRow({ F }, row), ["[ 2 -x ] * [ -2 +y ] - [ 1 ] = 0"]);
        assert.deepStrictEqual(printRow({ F }, [{ 0: F.negone }, {}, {}]), ["[ -1 ] * [  ] - [  ] = 0"]);
    });
});
