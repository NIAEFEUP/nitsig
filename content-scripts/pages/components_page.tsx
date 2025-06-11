// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import Button from "../components/Button";
import { Table } from "../components/Table";
import Icon from "../components/Icon";
import Card from "../components/Card";
import { Accordion } from "../components/Accordion";
import Tab from "../components/Tabs/Tab";
import TabList from "../components/Tabs/TabList";
import TabContent from "../components/Tabs/TabContent";
import TabPage from "../components/Tabs/TabPage";

const components = [
    "Icon",
    "Button",
    "Table",
    "Cards",
    "Accordion",
    "Text Components",
    "Tabs",
];

export function createComponentsPage() {
    // TODO: remove this check
    if (!document.location.href.toLowerCase().includes("components")) {
        return;
    }
    document.body.innerHTML = "";
    document.title = "Components";

    const sidebarItems = components.map((component) => (
        <a href={`#${component}`} key={component}>
            <li className="se-sidebar-item">{component}</li>
        </a>
    ));

    const page = (
        <div className="se-docs-container">
            {/* Sidebar */}
            <div className="se-sidebar">
                <img
                    src={chrome.runtime.getURL("images/logo/extended.png")}
                    alt="NitSig Logo"
                    width="100"
                />
                <ul>{sidebarItems}</ul>
            </div>

            {/* Main Content */}
            <div className="se-main-content">
                <h1>NitSig Components</h1>
                <div className="introduction">
                    <p>
                        These components were created by the NitSig team in
                        order to use them across the Sigarra pages.
                    </p>
                    <p>
                        If you find something in your Sigarra that would be
                        interesting to change by one of the following
                        components, send an email to{" "}
                        <a href="mailto:ni@aefeup.pt">ni@aefeup.pt</a>.
                    </p>
                    <p>
                        Interesting to see the extension code base? Check our
                        open source{" "}
                        <a
                            href="https://github.com/NIAEFEUP/nitsig"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub Repository
                        </a>
                        !
                    </p>
                </div>

                {/* Icon */}
                <Component
                    name="Icon"
                    description="Talking about icons, we exclusive use the Remix Icon library, the outlined style! Check remixicon.com for all the available icons."
                    code={`
<Icon name="ri-notification-line" />
            `}
                >
                    <Icon name="ri-notification-line" />
                </Component>

                {/* Button */}
                <Component
                    name="Button"
                    description="Our button abstraction that can be used to create buttons with icons and text. "
                    code={`
<Button
  name="MY BUTTON"
  text="Click me"
  icon="ri-notification-line"
  onclick={() => console.log("Button was clicked")}
/>
            `}
                >
                    <Button
                        title="Small"
                        size="sm"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Medium"
                        size="md"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Large"
                        size="lg"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Full"
                        radius="full"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Large"
                        radius="lg"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Medium"
                        radius="md"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Small"
                        radius="sm"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="None"
                        radius="none"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Default"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Primary"
                        color="primary"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Solid"
                        variant="solid"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Outline"
                        variant="outline"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Link"
                        variant="link"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Outline Primary"
                        variant="outline"
                        color="primary"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Link Primary"
                        variant="link"
                        color="primary"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        title="Icon"
                        icon="ri-notification-line"
                        onclick={() => console.log("Button was clicked")}
                    />
                    <Button
                        icon="ri-notification-line"
                        radius="full"
                        onclick={() => console.log("Button was clicked")}
                    />
                </Component>

                {/* Table */}
                <Component
                    name="Table"
                    description="A simple table design with sorting capabilities on column headers."
                    code={`
<Table
  name="my_table"
  headers={[
    ["Component", "Component"],
    ["Description", "Description"],
    ["Status", "Status"]
  ]}
  data={[
    ["Button", "A button that can be clicked", "In progress"],
    ["Input", "A text input field", "Complete"]
  ]}
/>
            `}
                >
                    <Table
                        name="my_table"
                        headers={[
                            ["Component", "Component"],
                            ["Description", "Description"],
                            ["Status", "Status"],
                        ]}
                        data={[
                            [
                                "Button",
                                "A button that can be clicked",
                                "In progress",
                            ],
                            ["Input", "A text input field", "Complete"],
                        ]}
                    />
                </Component>
                {/* Card */}
                <Component
                    name="Card"
                    description="Our card component, that allows the creation of cards with different styles."
                    code={`<Card 
id="1"
title="Default Card"
description="I have all attributes possible (i.e; image, title, description, subtitles and a button)"
subtitles={["One", "Two"]}
imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThD4or2R-Tpyokw8NzJyn-LXt6R8YK9Sih5w&s"
button ={<Button title="Button" variant="solid" size="sm" color="primary"/>}
/>
`}
                >
                    <Card
                        id="1"
                        className="se-card"
                        title="Default Card"
                        description="I have all attributes possible (i.e; image, title, description, subtitles and a button)"
                        subtitles={["One", "Two"]}
                        imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThD4or2R-Tpyokw8NzJyn-LXt6R8YK9Sih5w&s"
                        button={
                            <Button
                                title="Button"
                                variant="solid"
                                size="sm"
                                color="primary"
                            />
                        }
                    />
                    <Card
                        id="2"
                        className="se-card"
                        title="Alt Card 1"
                        description="I don't have subtitles"
                        imgSrc="https://preview.redd.it/i-once-found-a-silly-cat-picture-in-black-and-white-v0-tzn8uvux7vmd1.png?width=236&format=png&auto=webp&s=f17ce524ff01e70fce304712ca5bf58a194b5fbe"
                        button={
                            <Button
                                title="Button"
                                variant="solid"
                                size="sm"
                                color="primary"
                            />
                        }
                    />
                    <Card
                        id="3"
                        className="se-card"
                        title="Alt Card 2"
                        description="I don't have an image nor subtitles"
                        button={
                            <Button
                                icon="ri-notification-line"
                                radius="full"
                                color="primary"
                            />
                        }
                    />
                </Component>

                {/* Accordion */}
                <Component
                    name="Accordion"
                    description="A collapsible component that can expand to show or hide content."
                    code={`
<Accordion
  id="example-accordion"
  header= 
    { <h3>Expandable Content</h3> }
  max_size={200}
>
    <p>This is the content of the accordion</p>
    <p>This is more content</p>
    <Table
        name="my_table_accordion"
        headers={[
            ["Component", "Component"],
            ["Description", "Description"],
            ["Status", "Status"],
        ]}
        data={[
            ["Button", "A button that can be clicked", "In progress"],
            ["Input", "A text input field", "Complete"],
        ]}
    />
</Accordion>
                    `}
                >
                    <Accordion
                        id="example-accordion"
                        header={<h3>Expandable Content</h3>}
                        max_size={200}
                    >
                        <p>This is the content of the accordion</p>
                        <p>This is more content</p>
                        <Table
                            name="my_table_accordion"
                            headers={[
                                ["Component", "Component"],
                                ["Description", "Description"],
                                ["Status", "Status"],
                            ]}
                            data={[
                                [
                                    "Button",
                                    "A button that can be clicked",
                                    "In progress",
                                ],
                                ["Input", "A text input field", "Complete"],
                            ]}
                        />
                    </Accordion>
                </Component>

                {/* Text Components */}
                <Component
                    name="Text Components"
                    description="Text Components used to standardize headers, text and other text elements"
                    code={`
<div style="display: flex; flex-direction: column; align-items: center; margin: 0 auto;">

<h1 id="se-header-large" style="color:black;">Large Header</h1>
<h2 id="se-header-medium" style="color:black;">Medium Header</h2>
<h3 id="se-header-small" style="color:black;">Small Header</h3>

<h4 id="se-page-title">Page Title</h4>
<h4 id="se-subtitle">Subtitle</h4>

<p id="se-body-text">This is some text</p>
<p id="se-small-text">This is a small text</p>

<p id="se-description">This is as description text</p>
            `}
                >
                    <div style="display: flex; flex-direction: column; align-items: center; margin: 0 auto;">
                        <h1 id="se-header-large" style="color:black;">
                            Large Header
                        </h1>
                        <h2 id="se-header-medium" style="color:black;">
                            Medium Header
                        </h2>
                        <h3 id="se-header-small" style="color:black;">
                            Small Header
                        </h3>

                        <h4 id="se-page-title">Page Title</h4>
                        <h4 id="se-subtitle">Subtitle</h4>

                        <p id="se-body-text">This is some text</p>
                        <p id="se-small-text">This is a small text</p>

                        <p id="se-description">This is as description text</p>
                    </div>
                </Component>

                {/* Tabs Component */}
                <Component
                    name="Tabs"
                    description="A collection of related navigation links that allow users to switch between different pages or views."
                    code={`
{/* Link tabs */}
<TabList>
    <Tab href="hello">Hello</Tab>
    <Tab href="world">World</Tab>
    <Tab href="foo">Foo</Tab>
    <Tab href="bar">Bar</Tab>
</TabList>

{/* Button tabs */}
<TabList>
    <Tab id="hello">Hello</Tab>
    <Tab id="world">World</Tab>
    <Tab id="foo">Foo</Tab>
    <Tab id="bar">Bar</Tab>
</TabList>
<TabContent>
    <TabPage id="hello">
        <h1>Hello</h1>
        <p>This is the hello tab</p>
    </TabPage>
    <TabPage id="world">
        <h1>World</h1>
        <p>This is the world tab</p>
    </TabPage>
    <TabPage id="foo">
        <h1>Foo</h1>
        <p>This is the foo tab</p>
    </TabPage>
    <TabPage id="bar">
        <h1>Bar</h1>
        <p>This is the bar tab</p>
    </TabPage>
</TabContent>
                    `}
                >
                    <TabList>
                        <Tab id="hello">Hello</Tab>
                        <Tab id="world">World</Tab>
                        <Tab id="foo">Foo</Tab>
                        <Tab id="bar">Bar</Tab>
                    </TabList>
                    <TabContent>
                        <TabPage id="hello">
                            <h1>Hello</h1>
                            <p>This is the hello tab</p>
                        </TabPage>
                        <TabPage id="world">
                            <h1>World</h1>
                            <p>This is the world tab</p>
                        </TabPage>
                        <TabPage id="foo">
                            <h1>Foo</h1>
                            <p>This is the foo tab</p>
                        </TabPage>
                        <TabPage id="bar">
                            <h1>Bar</h1>
                            <p>This is the bar tab</p>
                        </TabPage>
                    </TabContent>
                </Component>
            </div>
        </div>
    );

    document.body.appendChild(page);
}

interface ComponentProps {
    name: string;
    description: string;
    code: string;
}

const Component: JSX.Component<ComponentProps> = (
    { name, description, code },
    children,
) => (
    <div id={name} className="se-component-section">
        <h2>{name}</h2>
        <p>{description}</p>
        <div className="se-component-show">{children}</div>
        <pre className="se-code-block">{code}</pre>
        {/* TODO(thePeras): Add Props field, so we can know the Component Reference and the default values */}
    </div>
);
