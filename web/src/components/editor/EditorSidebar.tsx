import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Colorful } from "@uiw/react-color";

const GeneralSettings = () => {
  const [color, setColor] = useState("#fffff")

  return (
    <div>
      <div>
        <p className="font-medium pb-2">Button Background</p>
        <Colorful color={color}
          onChange={(color) => {
            setColor(color.hex);
          }} />
      </div>
    </div>
  )
}

const AdvancedSettings = () => {
  return (
    <div>
      Advanced Settings
    </div>
  )
}

export function EditorSidebar() {
  const [activeTab, setActiveTab] = React.useState("general");
  const data = [
    {
      label: "General",
      value: "general",
    },
    {
      label: "Advanced",
      value: "advanced",
    }
  ];
  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
      >
        {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-gray-900" : ""}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {value === 'general' ? <GeneralSettings /> : <AdvancedSettings />}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}