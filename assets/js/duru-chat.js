(function () {
  var productionChatUrl = "https://rustamdurdyyev.streamlit.app/?embed=true";
  var localChatUrl = "http://127.0.0.1:8501/?embed=true";
  var isLocalPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  var chatUrl = isLocalPreview ? localChatUrl : productionChatUrl;

  if (document.getElementById("duru-chat-widget")) {
    return;
  }

  var widget = document.createElement("section");
  widget.id = "duru-chat-widget";
  widget.className = "duru-chat-widget";
  widget.setAttribute("aria-label", "Ask DuRu chatbot");

  widget.innerHTML =
    '<div id="duru-chat-panel" class="duru-chat-panel" hidden>' +
    '<div class="duru-chat-header">' +
    '<div class="duru-chat-title">Ask DuRu</div>' +
    '<div class="duru-chat-actions">' +
    '<a class="duru-chat-open" href="' + chatUrl + '" target="_blank" rel="noopener" aria-label="Open Ask DuRu in a new tab">' +
    '<i class="fa-solid fa-up-right-from-square" aria-hidden="true"></i>' +
    "</a>" +
    '<button class="duru-chat-close" type="button" aria-label="Close Ask DuRu">' +
    '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
    "</button>" +
    "</div>" +
    "</div>" +
    '<iframe id="duru-chat-frame" class="duru-chat-frame" title="Ask DuRu about Rustam" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="clipboard-write"></iframe>' +
    "</div>" +
    '<button id="duru-chat-button" class="duru-chat-button" type="button" aria-expanded="false" aria-controls="duru-chat-panel">' +
    '<i class="fa-solid fa-comments" aria-hidden="true"></i>' +
    "<span>Ask DuRu</span>" +
    "</button>";

  document.body.appendChild(widget);

  var button = document.getElementById("duru-chat-button");
  var panel = document.getElementById("duru-chat-panel");
  var closeButton = widget.querySelector(".duru-chat-close");
  var frame = document.getElementById("duru-chat-frame");

  function openPanel() {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");

    if (!frame.src) {
      frame.src = chatUrl;
    }
  }

  function closePanel() {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.focus();
  }

  button.addEventListener("click", function () {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeButton.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  if (window.location.pathname === "/" && window.matchMedia("(min-width: 769px)").matches) {
    window.setTimeout(openPanel, 700);
  }
})();
