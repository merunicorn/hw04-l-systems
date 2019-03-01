
class ExpansionRule {
  input: string;
  expansion: string;

  constructor(input: string) {
    this.input = input;
    if (input == "F") {
        this.expansion = "FF";
    }
    else if (input == "X") {
        this.expansion = "[+FX][-FX]FFX";
    }
    else {
        this.expansion = input;
    }
  }

  getExpansion(): string {
    return this.expansion;
  }
};

export default ExpansionRule;
