const seed01 = {
  label: "Example #1",
  dataStructure: `
## Person A

+ name: \`Jack\` (string, required)
+ age: 54 (number)

## Person B

+ name: \`Mark\` (string, required)
+ age: 34 (number)
+ partners (array, fixed-type)
  + (object)
      + Include Person A
  `,
  mson: `
+ people (array, fixed-type, required)
  + (object)
      + Include Person A
  + (object)
      + Include Person B
  `
};

const seed02 = {
  label: "Example #2",
  dataStructure: ``,
  mson: `
+ say (object, required)
  + hello: \`world!\` (string, required)
  `
};

const seeds = [seed01, seed02];

export const seedLabels = seeds.map((seed, index) => ({
  label: seed.label,
  value: index
}));

export default seeds;
