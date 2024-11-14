// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jsx from "texsaur";
import Button from "../components/Button";
import { Table } from "../components/Table";
import Icon from "../components/Icon";
import { Accordion } from "../components/Accordion";

const components = ["Icon", "Button", "Table", "Accordion"];

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

                {/* Accordion */}
                <Component
                    name="Accordion"
                    description="A collapsible component that can expand to show or hide content."
                    code={`
<Accordion
  id="example-accordion"
  title="Expandable Content"
  data={<p>This is the content of the accordion</p>}
  max_size={200}
/>
                    `}
                >
                    <Accordion
                        id="example-accordion"
                        title="Expandable Content"
                        data={[<p>This is the content of the accordion</p>,
                            <p>This is the content of the accordion</p>,
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
                        ]}
                        max_size={200}
                    />
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
