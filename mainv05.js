// import { CLOSE_ICON, MESSAGE_ICON, styles} from "./asset"
const styles = `
    .widget__container * {
        box-sizing: border-box;
    }        
    h3, p, input {
        margin: 0;
        padding: 0;
    }
    .widget__container {
        box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);
        width: 400px;
        min-height: 40em;
        overflow: auto;
        right: -25px;
        bottom: 75px;
        position: absolute;
        transition: max-height .2s ease;
        font-family: Helvetica, Arial ,sans-serif;
        background-color: #FFF;
        border-radius: 10px;
        box-sizing: border-box;
    }
    .widget__icon {
        cursor: pointer;
        width: 60%;
        position: absolute;
        top: 18px;
        left: 16px;
        transition: transform .3s ease;
    }
    .widget__hidden {
        transform: scale(0);
    }
    .button__container {
        border: none;
        background-color: #0f172a;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
    }
    .widget__container.hidden {
        max-height: 0px;
    }
    .widget__header {
        padding: 1rem 2rem 1.5rem;
        background-color: #000;
        color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: center;
    }
    .widget__header h3 {
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 8px;
    }
    form {
        padding: 2rem 1rem 1.5rem;
    }
    form .form__field {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
    }
    .form__field label {
        margin-bottom: 8px;
        font-size: 14px;
    }
    .form__field input,
    .form__field textarea {
        border: 1px solid #000000ad;
        width:28.6em;
        border-radius: 3px;
        padding: 8px 10px;
        background-color: #fff;
        position:absolute;
        left:10px;
        bottom:10px;
        padding-right:50px;
        resize:none;
    }
    #message-box {
        display: inline-block;
        vertical-align: middle;
      }
    #send-icon {
        position:absolute;
        left: 22em;
        bottom: 12px;
        vertical-align: middle;
        cursor: pointer;
    }  
    .form__field input {
        height: 48px;
    }
    .form__field textarea::placeholder {
        font-family: Helvetica, Arial ,sans-serif;
    }
    form button {
        height: 48px;
        border-radius: 6px;
        font-size: 18px;
        background-color: #000;
        color: #fff;
        border: 0;
        width: 100%;
        cursor: pointer;
    }
    form button:hover {
        background-color: rgba(0, 0, 0, 95%);
    }    
    .chatbot .chat {
        display: flex;
    }
    
    .chatbot .chat p{
        color:#fff;
        font-size: 0.95rem;
        padding: 12px 16px;
        border-radius: 10px 10px 0 10px;
        background: blue;
        margin-right:10px;
        max-width: 75%;
    }
    
    .chatbot .incoming p{
        color:#000;
        background: #f2f2f2;
        border-radius: 10px 10px 10px 0;
    }
    
    .chatbot .outgoing{
        justify-content: flex-end;
        margin: 20px 0;
    }
    
    .chatbot .chat-input{
        position: absolute;
        bottom: 0;
        width: 100%;
        background: #fff;
        display: flex;
        gap: 5px;
        border-top: 1px solid #000;
        padding: 5px 20px;
    }
    
    .chatbot ul {
        padding-left:10px;
        max-height: 28.5em;
        overflow: scroll;
    }

    .chat-input textarea{
        height: 55px;
        width: 100%;
        border:none;
        outline: none;
        font-size: 0.95rem;
        resize: none;
        padding: 16px 15px 16px 0;
    }
`;

const MESSAGE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
`;

const CLOSE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
`;

const uuid = ""

class MessageWidget {
  constructor(position) {  
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



function initializeWidget() {
  return new MessageWidget("bottom-right");
}
function getSyncScriptParams() {
  var script = document.getElementById("docu-chat")
  var scriptName = script;
  var uuid = scriptName.getAttribute('data-uuid')
  return uuid
}

initializeWidget();

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
  var uuid = getSyncScriptParams()
  try {
    chatbox.appendChild(createChatLi("thinking...","incoming"))
    const res = await fetch("http://127.0.0.1:5000/sendMessage", {
      method: "POST",
      body: JSON.stringify({
        message: userMessage,
        collection_name: uuid
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