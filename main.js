import { CLOSE_ICON, MESSAGE_ICON, styles} from "./asset"

class MessageWidget {
  constructor(position,uuid) {  
    console.log(uuid)
    this.position = this.getPosition(position);
    this.open = false;
    this.initialize();
    this.injectStyles(); }

  position = "";
  open = false;
  widgetContainer = null;

  getPosition(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  async initialize() {
    /**
     * Create and append a div element to the document body
     */
    const container = document.createElement("div");
    container.style.position = "fixed";
    Object.keys(this.position).forEach(
      (key) => (container.style[key] = this.position[key])
    );
    document.body.appendChild(container);

    /**
     * Create a button element and give it a class of button__container
     */
    const buttonContainer = document.createElement("button");
    buttonContainer.classList.add("button__container");

    /**
     * Create a span element for the widget icon, give it a class of `widget__icon`, and update its innerHTML property to an icon that would serve as the widget icon.
     */
    const widgetIconElement = document.createElement("span");
    widgetIconElement.innerHTML = MESSAGE_ICON;
    widgetIconElement.classList.add("widget__icon");
    this.widgetIcon = widgetIconElement;

    /**
     * Create a span element for the close icon, give it a class of `widget__icon` and `widget__hidden` which would be removed whenever the widget is closed, and update its innerHTML property to an icon that would serve as the widget icon during that state.
     */
    const closeIconElement = document.createElement("span");
    closeIconElement.innerHTML = CLOSE_ICON;
    closeIconElement.classList.add("widget__icon", "widget__hidden");
    this.closeIcon = closeIconElement;

    /**
     * Append both icons created to the button element and add a `click` event listener on the button to toggle the widget open and close.
     */
    buttonContainer.appendChild(this.widgetIcon);
    buttonContainer.appendChild(this.closeIcon);
    buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

    /**
     * Create a container for the widget and add the following classes:- `widget__hidden`, `widget__container`
     */
    this.widgetContainer = document.createElement("div");
    this.widgetContainer.classList.add("widget__hidden", "widget__container");

    /**
     * Invoke the `createWidget()` method
     */
    this.createWidgetContent();

    /**
     * Append the widget's content and the button to the container
     */
    container.appendChild(this.widgetContainer);
    container.appendChild(buttonContainer);
  }

  createWidgetContent() {
    this.widgetContainer.innerHTML = `
        <header class="widget__header">
            <h3>SmartBot</h3>
            <p>How can I help you today?</p>
        </header>
        <div class="chatbot">
        <ul class="chatbot">
          <li class="chat incoming">
            <p>Hi There how can I help you?</p>
          </li>
          <li class="chat outgoing">
            <p>come ti chiami?</p>
          </li>
        </ul>
        <div class="chat-input">
          <textarea id="textarea" placeholder="Enter a message here..."></textarea>
          <span id="send-btn" class="material-symbol-outlined">send</span>
        </div>
      </div>
    `;
  }

  injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.widgetIcon.classList.add("widget__hidden");
      this.closeIcon.classList.remove("widget__hidden");
      this.widgetContainer.classList.remove("widget__hidden");
    } else {
      this.createWidgetContent();
      this.widgetIcon.classList.remove("widget__hidden");
      this.closeIcon.classList.add("widget__hidden");
      this.widgetContainer.classList.add("widget__hidden");
    }
  }
}

function initializeWidget(uuid) {
  return new MessageWidget("bottom-right",uuid);
}

initializeWidget("123123123");

const chatInput = document.querySelector("#textarea");
const sendChatBtn = document.querySelector("#send-btn");
const chatbox = document.querySelector(".chatbot ul");

const createChatLi = (message, className) =>{
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  chatInput.value = "";
  return chatLi;
}

let userMessage;
const handleChat = () => {
  userMessage = chatInput.value.trim();
  if(!userMessage) return;

  
  chatbox.appendChild(createChatLi(userMessage,"outgoing"))
 getAnswer(userMessage)
}

async function getAnswer(userMessage){
  try {
    chatbox.appendChild(createChatLi("thinking...","incoming"))
    const res = await fetch("http://127.0.0.1:5000/sendMessage", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const data = await res.json();
    chatbox.appendChild(createChatLi(data,"incoming"))
  } catch (error) {
    console.log(error)
  }
}

sendChatBtn.addEventListener("click", handleChat)