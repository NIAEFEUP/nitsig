import jsx from "texsaur";
import Button from "../components/Button";
import { Table } from "../components/Table";
import Icon from "../components/Icon";

const components = ["Icon", "Button", "Table"];

export function createComponentsPage() {
  if (!document.location.href.toLowerCase().includes("components")) {
    return;
  }
  document.body.innerHTML = "";
  document.title = "Components";

  const sidebarItems = components.map((component) => (
    <a href={`#${component}`} key={component}>
      <li className="se-sidebar-item">
        {component}
      </li>
    </a>
  ));

  const page = (
    <div className="se-docs-container">
      {/* Sidebar */}
      <div className="se-sidebar">
        <img src={chrome.runtime.getURL("images/logo/extended.png")} alt="NitSig Logo" width="100" />
        <ul>{sidebarItems}</ul>
      </div>

      {/* Main Content */}
      <div className="se-main-content">
        <h1>NitSig Components</h1>
        <div className="introduction">
          <p>These components were created by the NitSig team in order to use them across the Sigarra pages.</p>
          <p>If you find something in your Sigarra that would be interesting to change by one of the following components, send an email to <a href="mailto:ni@aefeup.pt">ni@aefeup.pt</a>.</p>
          <p>Interesting to see the extension code base? Check our open source <a href="https://github.com/NIAEFEUP/nitsig" target="_blank" rel="noopener noreferrer">GitHub Repository</a>!</p>
        </div>

        {/* Icon */}
        <Component name="Icon"
          description="Talking about icons, we exclusive use the Remix Icon library, the outlined style! Check remixicon.com for all the available icons."
          code={`
<Icon name="ri-notification-line" />
            `}
        >
          <Icon name="ri-notification-line" />
        </Component>

        {/* Button */}
        <Component name="Button"
          description="Our button abstraction that can be used to create buttons with icons and text."
          code={`
<Button
  name="my_button"
  text="Click me"
  icon="ri-notification-line"
  onclick={() => alert("Button was clicked")}
/>
            `}

        >
          <Button title="my_button" icon="ri-notification-line" onclick={() => alert("Button was clicked")} />
        </Component>


        {/* Table */}
        <Component name="Table"
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
              ["Status", "Status"]
            ]}
            data={[
              ["Button", "A button that can be clicked", "In progress"],
              ["Input", "A text input field", "Complete"]
            ]}
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

const Component: JSX.Component<ComponentProps> = ({ name, description, code }, children) => (
  <div id={name} className="se-component-section" >
    <h2>{name}</h2>
    <p>{description}</p>
    <div className="se-component-show">
      {children}
    </div>
    <pre className="se-code-block">
      {code}
    </pre>
  </div>
);