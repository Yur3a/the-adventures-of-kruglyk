export interface MathProblem {
  first: number;
  second: number;
  answer: number;
  display: string;
}

export class MathProblemGenerator {
  private readonly problems: MathProblem[] = [];
  private readonly random: () => number;

  constructor(random: () => number = Math.random) {
    this.random = random;
    for (let first = 1; first < 20; first++) {
      for (let second = 1; first + second <= 20; second++) {
        this.problems.push({ first, second, answer: first + second, display: `${first} + ${second}` });
      }
    }
  }

  generate(previous?: MathProblem): MathProblem {
    const candidates = this.problems.filter((problem) => problem.display !== previous?.display);
    return { ...candidates[Math.floor(this.random() * candidates.length)] };
  }
}
