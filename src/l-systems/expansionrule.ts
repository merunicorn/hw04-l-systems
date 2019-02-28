
class ExpansionRule {
  input: string;
  expansion: string;

  constructor(input: string) {
    this.input = input;
    if (input == "F") {
        this.expansion = "FF";
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
