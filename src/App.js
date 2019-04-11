import React, { useState, useEffect } from "react";
import ReactJson from "react-json-view";
import { Flex, Box, Heading, Link } from "rebass";
import useDebouncedCallback from "use-debounce/lib/callback";
import GithubCorner from "react-github-corner";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Accordion, AccordionItem } from "react-sanfona";
import useWindowSize from "@rehooks/window-size";
import Dropdown from "react-dropdown";

import Editor from "./Editor";
import { toSource, bodySchema } from "./parser";
import seeds, { seedLabels } from "./seed";
import "./App.css";

const JSONTree = ({ source, displayDataTypes = false }) => (
  <ReactJson
    src={source}
    enableClipboard={false}
    name={false}
    theme="monokai"
    displayDataTypes={displayDataTypes}
    style={{
      fontSize: 14,
      fontFamily:
        "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace"
    }}
  />
);

const Warnings = ({ annotations }) => {
  if (!annotations) {
    return null;
  }

  return (
    <Box bg="red" p={1} my={2}>
      <ul>
        {annotations.map(item => (
          <li>{item}</li>
        ))}
      </ul>
    </Box>
  );
};

const ResultRender = ({ data }) => {
  if (data.annotations) {
    return <Warnings annotations={data.annotations} />;
  }

  return (
    <Tabs>
      <TabList>
        <Tab>JSON</Tab>
        <Tab>Schema</Tab>
      </TabList>

      <TabPanel>
        <JSONTree source={data.body} />
      </TabPanel>
      <TabPanel>
        <JSONTree source={data.schema} displayDataTypes={false} />
      </TabPanel>
    </Tabs>
  );
};

const Result = ({ source }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    bodySchema(source).then(data => {
      setData(data);
    });
  }, [source]);

  return (
    <Box mr={[1, 4]}>
      <ResultRender data={data} />
    </Box>
  );
};

const tplSource = (index) => toSource({
  dataStructure: seeds[index].dataStructure,
  mson: seeds[index].mson
});

const toHeight = (height, count) => {
  const divider = 120;

  if (count <= 1) return height - divider;

  return height / count - divider / count;
};

const App = () => {
  const { innerHeight } = useWindowSize();

  const [index, setIndex] = useState(0);
  const [dataStructure, setDataStructure] = useState(seeds[index].dataStructure);
  const [mson, setMson] = useState(seeds[index].mson);
  const [source, setSource] = useState(tplSource(index));
  const [count, setCount] = useState(2);

  const [sourceCallback] = useDebouncedCallback(
    (dataStructure, mson) => {
      const value = toSource({ dataStructure, mson });
      setSource(value);
    },
    500,
    [dataStructure, mson]
  );

  const onChange = index => {
    setIndex(index);
    setDataStructure(seeds[index].dataStructure);
    setMson(seeds[index].mson);
    setSource(tplSource(index));
  };

  useEffect(() => {
    sourceCallback(dataStructure, mson);
  });

  const onExpand = () => setCount(count + 1);
  const onClose = () => setCount(count - 1);

  return (
    <Flex flexWrap="wrap" px={2} py={3}>
      <Box width={[1, 1 / 2, 2 / 5]} px={3}>
        <Dropdown
          options={seedLabels}
          value={seedLabels[index]}
          onChange={({ value }) => onChange(value)}
        />
        <Accordion allowMultiple={true} duration={0}>
          <AccordionItem
            title="Data Structures"
            expanded={true}
            onExpand={onExpand}
            onClose={onClose}
          >
            <Editor
              code={dataStructure}
              onValueChange={code => setDataStructure(code)}
              height={toHeight(innerHeight, count)}
            />
          </AccordionItem>
          <AccordionItem
            title="MSON"
            expanded={true}
            onExpand={onExpand}
            onClose={onClose}
          >
            <Editor
              code={mson}
              onValueChange={code => setMson(code)}
              height={toHeight(innerHeight, count)}
            />
          </AccordionItem>
        </Accordion>
      </Box>
      <Box width={[1, 1 / 2, 3 / 5]} px={2}>
        <Heading textAlign="center" m={[3, 1]}>
          <Link href="https://github.com/apiaryio/mson" color="white">
            MSON
          </Link>{" "}
          Playground
        </Heading>
        <Result source={source} />
      </Box>
      <GithubCorner
        bannerColor="#D71149"
        href="https://github.com/bukalapak/mson-playground"
      />
    </Flex>
  );
};

export default App;
