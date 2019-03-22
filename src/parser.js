import drafter from "drafter.js";
import minim from "minim";
import minimParseResult from "minim-parse-result";
import minimApiDescription from "minim-api-description";

const namespace = minim
  .namespace()
  .use(minimParseResult)
  .use(minimApiDescription);

async function parse(source, options) {
  return new Promise((resolve, reject) => {
    drafter.parse(source, options, (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
}

const whitespace = mson => {
  return mson
    .split("\n")
    .map((val, index) => {
      return index === 0 ? val : " ".repeat(8) + val;
    })
    .join("\n");
};

const toSource = ({ dataStructure, mson }) => {
  return `
# GET /

+ Response 200 (application/json)
    + Attributes (object)
        ${whitespace(mson)}

# Data Structures

${dataStructure}
  `;
};

const bodySchema = async source => {
  const refract = await parse(source);
  const element = namespace.fromRefract(refract);

  const annotations = element.annotations.toValue();

  if (annotations.length !== 0) {
    return {
      annotations
    };
  }

  const resource = element.api.resources.get(0);

  if (!resource) return {};

  const body = resource.transitions
    .get(0)
    .transactions.get(0)
    .response.messageBody.toValue();

  const schema = resource.transitions
    .get(0)
    .transactions.get(0)
    .response.messageBodySchema.toValue();

  return {
    body: JSON.parse(body),
    schema: JSON.parse(schema)
  };
};

export { toSource, bodySchema };
