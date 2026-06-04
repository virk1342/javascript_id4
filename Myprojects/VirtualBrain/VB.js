// ╔══════════════════════════════════════════════════════════════════╗
// ║               VIRTUAL BRAIN — FULLY COMMENTED JS                ║
// ║   Every single line explained for someone learning JavaScript    ║
// ╚══════════════════════════════════════════════════════════════════╝


// =====================================================================
// WHAT IS A VARIABLE?
// A variable is like a labelled box where you store information.
// "let" means the box's contents can change later.
// "const" means the box's contents can NEVER change after you set it.
// =====================================================================


// =====================================================================
// SECTION 1 — STATE VARIABLES
// "State" just means "the current situation of the app".
// These variables remember what's happening at any moment.
// =====================================================================

// Stores the user's Anthropic API key so we can send it with every AI request.
// Starts as an empty string '' because no key has been typed yet.
let apiKey = '';

// Stores everything the user said during recording (the full lecture text).
// This builds up word by word as the user speaks.
let finalTranscript = '';

// A copy of the transcript that we pass to the chatbot.
// We keep it separate so the chatbot always knows what the lecture was about,
// even if the user records something new.
let lectureContext = '';

// An ARRAY (a list) that stores the full conversation between user and AI.
// Every question and every answer gets added here so the AI remembers
// the whole conversation, not just the latest message.
// Starts as [] which means "empty list".
let chatMessages = [];

// Will hold the MediaRecorder object (the thing that records audio).
// Set to null for now because recording hasn't started yet.
// null means "this variable exists but has nothing in it yet".
let mediaRecorder = null;

// Will hold the SpeechRecognition object (the thing that converts speech to text).
// Also null for now — gets created when recording starts.
let recognition = null;

// A true/false flag that tracks whether we are currently recording.
// We use this so the recognition doesn't auto-stop (more on this later).
let isRecording = false;

// A simple counter used to give each "loading" message a unique ID.
// Starts at 0, goes up by 1 each time we show a loading spinner.
let loadingCounter = 0;


// =====================================================================
// SECTION 2 — SPEECH RECOGNITION SETUP
//
// "Speech Recognition" is a built-in browser feature that listens to
// your microphone and converts what you say into text automatically.
//
// Different browsers name it differently:
//   - Chrome uses:         window.SpeechRecognition
//   - Older Chrome uses:   window.webkitSpeechRecognition
//
// The || (OR) operator means: "try the first one, if it doesn't exist,
// use the second one". This makes our code work on both.
// =====================================================================

const SpeechRecognition =
    window.SpeechRecognition ||        // Standard name (newer browsers)
    window.webkitSpeechRecognition;    // Older name (older Chrome versions)

// Check if the browser supports Speech Recognition at all.
// The ! (exclamation mark) means NOT — so !SpeechRecognition means
// "if SpeechRecognition does NOT exist".
if (!SpeechRecognition) {
    // alert() shows a popup message to the user.
    alert(
        'Speech Recognition not supported. Please use Google Chrome.'
    );
}


// =====================================================================
// SECTION 3 — WHAT IS A FUNCTION?
//
// A function is a reusable block of code with a name.
// You write it once, then "call" (run) it whenever you need it.
//
// Example:
//   function sayHello() {
//       alert("Hello!");
//   }
//   sayHello(); // This runs the code inside the function
// =====================================================================


// =====================================================================
// FUNCTION: saveApiKey
// Runs when the user clicks "Save Key".
// Reads the API key they typed, saves it to our variable.
// =====================================================================

function saveApiKey() {

    // document.getElementById('apiKeyInput') finds the HTML element
    // on the page that has id="apiKeyInput".
    // .value reads whatever text is currently typed inside that input box.
    // .trim() removes any accidental spaces at the start or end.
    apiKey = document.getElementById('apiKeyInput').value.trim();

    // If apiKey is empty (the user didn't type anything), show an alert and stop.
    // The "return" keyword exits the function immediately — nothing below runs.
    if (!apiKey) {
        alert('Please paste your API key first.');
        return; // STOP here, don't continue
    }

    // Find the "Saved!" confirmation message element on the page.
    const saved = document.getElementById('apiSaved');

    // Make it visible by setting its CSS display to 'flex'.
    // (It's hidden by default with display: none in the CSS.)
    saved.style.display = 'flex';

    // setTimeout runs a function after a delay.
    // () => { ... } is an "arrow function" — a short way to write a function.
    // 2000 means 2000 milliseconds = 2 seconds.
    // So: after 2 seconds, hide the "Saved!" message again.
    setTimeout(() => {
        saved.style.display = 'none'; // Hide the saved message after 2 seconds
    }, 2000);
}


// =====================================================================
// FUNCTION: setStatus
// Updates the small status text shown below the record buttons.
// For example: "Recording... speak clearly" or "Recording stopped."
//
// Parameters:
//   msg      = the text message to show
//   showDot  = true or false — should we show the red blinking dot?
// =====================================================================

function setStatus(msg, showDot) {

    // Find the status bar element in the HTML.
    const s = document.getElementById('statusLine');

    // A ternary operator is a short if/else written on one line.
    // Format: condition ? "value if true" : "value if false"
    // Here: if showDot is true, use the blinking dot HTML, otherwise use an info icon.
    const icon = showDot
        ? '<span class="vb-pulse"></span>'   // Red blinking dot (recording)
        : '<i class="ti ti-info-circle"></i>'; // Info circle icon (not recording)

    // Set the HTML inside the status bar.
    // We join the icon + a space + the message text.
    // innerHTML lets us put actual HTML tags inside (not just plain text).
    s.innerHTML = icon + ' ' + msg;
}


// =====================================================================
// FUNCTION: switchTab
// Handles clicking the "Notes & Summary" and "Ask your professor" tabs.
//
// Parameters:
//   tab = the name of the tab to show (e.g., 'notes' or 'chat')
//   el  = the actual tab button that was clicked
// =====================================================================

function switchTab(tab, el) {

    // document.querySelectorAll finds ALL elements matching a CSS selector.
    // '.vb-tab' means every element with class="vb-tab".
    // .forEach loops through each one and runs the function on it.
    // Here we remove the 'active' class from ALL tabs (deselect all).
    document.querySelectorAll('.vb-tab').forEach(t => {
        t.classList.remove('active');
    });

    // Same idea — hide ALL panels by removing 'active' from all of them.
    document.querySelectorAll('.vb-panel').forEach(p => {
        p.classList.remove('active');
    });

    // Now add 'active' back to just the tab that was clicked.
    // 'el' is the button element passed in when the user clicked it.
    el.classList.add('active');

    // Show the correct panel by adding 'active' to it.
    // 'panel-' + tab builds the ID, e.g. 'panel-notes' or 'panel-chat'.
    document.getElementById('panel-' + tab).classList.add('active');
}


// =====================================================================
// FUNCTION: startRecording
// Runs when user clicks "Start Recording".
// Sets up the microphone and starts listening.
//
// "async" means this function can WAIT for things (like mic permission).
// Without async/await, the browser wouldn't wait for the mic to be ready
// before continuing — it would just crash.
// =====================================================================

async function startRecording() {

    // Safety check — if Speech Recognition isn't supported, stop here.
    if (!SpeechRecognition) {
        alert('Speech recognition not supported. Use Google Chrome.');
        return;
    }

    // Clear any old transcript from a previous recording session.
    finalTranscript = '';

    // Also clear the transcript text box on screen.
    // .textContent sets plain text inside an element (no HTML tags).
    document.getElementById('liveTranscript').textContent = '';

    // Disable the Start button so user can't click it again while recording.
    // .disabled = true makes a button unclickable (grayed out).
    document.getElementById('recBtn').disabled = true;

    // Enable the Stop button so user can stop recording.
    document.getElementById('stopBtn').disabled = false;

    // Disable Generate Notes while recording (can't generate mid-session).
    document.getElementById('genBtn').disabled = true;

    // Show the red blinking dot next to the Start button.
    // 'inline-block' is a CSS display value that makes it visible.
    document.getElementById('recDot').style.display = 'inline-block';

    // Update the status bar — true means show the blinking dot.
    setStatus('Recording... speak clearly', true);

    // ---------------------------------------------------------------
    // ASK THE BROWSER FOR MICROPHONE PERMISSION
    //
    // navigator.mediaDevices.getUserMedia() asks the user:
    // "Can this website use your microphone?"
    //
    // "await" means: WAIT HERE until we get an answer before continuing.
    // Without await, the code would rush past before the user even clicked Allow.
    //
    // try/catch is error handling:
    //   - "try" = attempt this code
    //   - "catch" = if something goes wrong, run this instead (don't crash)
    // ---------------------------------------------------------------
    try {
        // { audio: true } means we only need audio (not video camera).
        await navigator.mediaDevices.getUserMedia({ audio: true });

    } catch (e) {
        // If the user clicked "Deny" or there's no mic, we land here.
        // 'e' is the error object — we don't need to use it here.
        alert('Microphone access denied. Please allow microphone access and try again.');
        resetButtons(); // Put buttons back to their original state
        return;         // Stop the function — don't start recording
    }

    // ---------------------------------------------------------------
    // CREATE THE SPEECH RECOGNITION OBJECT
    // Now that we have mic permission, set up speech-to-text.
    // ---------------------------------------------------------------

    // Create a fresh recognition object.
    recognition = new SpeechRecognition();

    // continuous = true means: keep listening forever, don't stop
    // after the first sentence. Without this, it stops after a pause.
    recognition.continuous = true;

    // interimResults = true means: show words WHILE the user is still speaking,
    // not just when they finish a full sentence.
    // This gives the "live typing" effect as you speak.
    recognition.interimResults = true;

    // Set the language to English (United States).
    // You could change this to 'fr-FR' for French, 'es-ES' for Spanish, etc.
    recognition.lang = 'en-US';

    // ---------------------------------------------------------------
    // HANDLE SPEECH RESULTS
    //
    // recognition.onresult is an "event handler" — a function that runs
    // automatically every time the browser recognises some speech.
    //
    // It fires repeatedly as you talk, giving us batches of words.
    // Each batch can contain "final" words (locked in) or "interim"
    // words (still being processed, may change).
    // ---------------------------------------------------------------

    recognition.onresult = (event) => {

        // Reset interim transcript each time this fires, because interim
        // results get replaced — they're not additive.
        let interimTranscript = '';

        // event.results is a list of all recognised speech so far.
        // event.resultIndex tells us which result is NEW this time.
        // We loop only through the NEW results (not ones we already processed).
        for (let i = event.resultIndex; i < event.results.length; i++) {

            // event.results[i].isFinal = true means this word/sentence is CONFIRMED.
            // The browser is sure about this text — it won't change.
            if (event.results[i].isFinal) {

                // [0] gets the top (most likely) transcript guess.
                // .transcript is the actual text string.
                // += means "add to the end of what's already there".
                // + ' ' adds a space between sentences.
                finalTranscript += event.results[i][0].transcript + ' ';

            } else {

                // isFinal = false means this is INTERIM — still being figured out.
                // We collect these separately (they'll be overwritten next time).
                interimTranscript += event.results[i][0].transcript;
            }
        }

        // Show the combined text on screen:
        // finalTranscript = all the locked-in words
        // interimTranscript = the words being processed right now
        // Together they show a smooth live transcription experience.
        document.getElementById('liveTranscript').textContent =
            finalTranscript + interimTranscript;
    };

    // ---------------------------------------------------------------
    // HANDLE RECOGNITION ERRORS
    //
    // recognition.onerror fires if something goes wrong with the mic.
    // ---------------------------------------------------------------

    recognition.onerror = (e) => {

        // 'no-speech' happens when there's silence — totally normal.
        // We just ignore it so we don't show a scary error message.
        // "return" exits the function early (does nothing for no-speech).
        if (e.error === 'no-speech') return;

        // For any other real error, show it in the status bar.
        setStatus('Mic error: ' + e.error, false);
    };

    // --------------------------------------------------------------- // KEEP RECOGNITION RUNNING CONTINUOUSLY
    //
    // Speech recognition stops automatically after a pause.
    // recognition.onend fires every time it stops.
    // We restart it if isRecording is still true — this is the trick
    // that makes it feel like it never stops!
    // ---------------------------------------------------------------

    recognition.onend = () => {
        // Only restart if we're still supposed to be recording.
        // When the user clicks Stop, isRecording becomes false,
        // so this check prevents it from restarting after Stop.
        if (isRecording) recognition.start();
    };

    // Set the flag to true — we are now officially recording.
    isRecording = true;

    // Begin listening!
    recognition.start();
}


// =====================================================================
// FUNCTION: stopRecording
// Runs when the user clicks "Stop".
// Turns off the microphone and speech recognition.
// =====================================================================

function stopRecording() {

    // Set isRecording to false FIRST.
    // This is important — the recognition.onend handler checks this flag.
    // If we set it to false before stopping, the onend handler won't restart it.
    isRecording = false;

    // If recognition exists (it should), stop it and clear the variable.
    if (recognition) {
        recognition.stop();  // Tell the browser to stop listening
        recognition = null;  // Clear the variable (garbage collection)
    }

    // Put all the buttons back to their normal state.
    resetButtons();

    // Update the status bar — false means no blinking dot.
    setStatus('Recording stopped. Transcript captured.', false);

    // .trim() removes whitespace from start and end.
    // If there's actual content in the transcript, enable the Generate button.
    if (finalTranscript.trim()) {
        document.getElementById('genBtn').disabled = false;
    }
}


// =====================================================================
// FUNCTION: resetButtons
// A helper function to reset all buttons to their default state.
// Called after starting fails OR after stopping recording.
// We put this in its own function to avoid repeating the same 3 lines twice.
// =====================================================================

function resetButtons() {
    document.getElementById('recBtn').disabled = false;  // Re-enable Start button
    document.getElementById('stopBtn').disabled = true;  // Disable Stop button
    document.getElementById('recDot').style.display = 'none'; // Hide blinking dot
}


// =====================================================================
// FUNCTION: generateNotes
// Runs when user clicks "Generate Notes".
// Sends the transcript to the Claude AI API and displays the result.
//
// "async" because we need to WAIT for the AI to respond (it takes a moment).
// =====================================================================

async function generateNotes() {

    // .trim() removes spaces. If the result is empty, there's no transcript.
    if (!finalTranscript.trim()) {
        alert('No transcript yet. Record a lecture first.');
        return; // Stop here
    }

    // Make sure the user has saved their API key.
    if (!apiKey) {
        alert('Please save your Anthropic API key first.');
        return; // Stop here
    }

    // ---------------------------------------------------------------
    // SHOW LOADING STATE
    // While we wait for the AI, we change the button text and show
    // a loading spinner so the user knows something is happening.
    // ---------------------------------------------------------------

    // Find the Generate button and save it in a variable so we can
    // change it and then change it back later.
    const btn = document.getElementById('genBtn');
    btn.disabled = true; // Can't click it again while loading
    btn.innerHTML = '<span class="vb-spinner"></span> Generating...'; // Change button text

    // Find the notes display box.
    const notesBox = document.getElementById('notesBox');

    // Show a loading message inside the notes box while we wait.
    // innerHTML lets us put HTML (like the spinner div) inside an element.
    notesBox.innerHTML =
        '<div class="vb-loading"><div class="vb-spinner"></div> Generating your notes...</div>';

    // ---------------------------------------------------------------
    // CALL THE CLAUDE AI API
    //
    // An API (Application Programming Interface) is a way for our
    // app to talk to another service (in this case, Anthropic's AI).
    //
    // fetch() sends a request to a URL (like visiting a webpage, but
    // in code). It returns a "Promise" — something that will finish later.
    // "await" makes us wait until it finishes before continuing.
    //
    // We wrap this in try/catch in case the internet is down,
    // the API key is wrong, or Anthropic's server has an error.
    // ---------------------------------------------------------------



    try {

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {

            // POST means we are SENDING data to the server (not just reading).
            // GET would be for just reading data.
            method: 'POST',

            // Headers are extra information we send along with the request.
            // Think of them like an envelope label that tells the serverx
            // who we are and what format we're sending.
            headers: {
                'Content-Type': 'application/json',       // We're sending JSON data
                'x-api-key': apiKey,                      // Our Anthropic API key (proves we're allowed)
                'anthropic-version': '2023-06-01',        // Which version of the API to use
                'anthropic-dangerous-direct-browser-access': 'true' // Required when calling from a browser
            },

            // body is the actual data we're sending.
            // JSON.stringify() converts a JavaScript object into a JSON string.
            // JSON is a text format that APIs understand.
            body: JSON.stringify({

                // Which AI model to use.
                model: 'claude-sonnet-4-20250514',

                // Maximum number of "tokens" (roughly words) in the reply.
                // 1000 tokens ≈ about 750 words.
                max_tokens: 1000,

                // The conversation we're sending. Each message has:
                //   role: 'user' (us) or 'assistant' (the AI)
                //   content: the actual text
                messages: [{
                    role: 'user',

                    // A template literal (backtick string) — lets us embed
                    // variables directly inside the string using ${variable}.
                    // Here we paste the full transcript into the prompt.
                    content: `You are a helpful study assistant. Based on this lecture transcript, produce:
1. A short summary (2-3 sentences)
2. Key topics covered (bullet list)
3. Important terms or concepts to remember (bullet list)
4. 3 likely exam questions

Use plain HTML with <h3> headings, <ul>/<li> for lists, and <p> for paragraphs.
Keep it concise and student-friendly.

Transcript:
${finalTranscript}`
                }]
            })
        });

        // The response comes back as raw data.
        // .json() converts it into a JavaScript object we can work with.
        // "await" again because this also takes a moment.
        const data = await response.json();

        // If the API returned an error (e.g. wrong key, quota exceeded),
        // data.error will exist. We throw it as an Error to jump to catch.
        if (data.error) throw new Error(data.error.message);

        // The AI's reply is in data.content[0].text
        //   data.content = an array (list) of response blocks
        //   [0] = the first (and usually only) block
        //   .text = the actual text string
        // We put this HTML directly into the notes box.
        notesBox.innerHTML = data.content[0].text;

        // Save the transcript as the "lecture context" for the chatbot.
        // Now when the user asks questions, the chatbot knows what was taught.
        lectureContext = finalTranscript;

        // Clear the old chat messages — fresh start for this new lecture.
        chatMessages = [];

        // Show the "no messages yet" placeholder in the chat panel again.
        const chatEmpty = document.getElementById('chatEmpty');
        if (chatEmpty) chatEmpty.style.display = 'block';

    } catch (err) {

        // If anything went wrong (network error, bad API key, etc.),
        // show the error message in the notes box in red.
        // err.message is the description of what went wrong.
        notesBox.innerHTML =
            '<p style="color:var(--color-text-danger)">Error: ' + err.message + '</p>';
    }

    // Restore the button whether it succeeded or failed.
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-sparkles"></i> Regenerate notes';
}


// =====================================================================
// FUNCTION: sendChat
// Runs when the user sends a question in the chatbox.
// Sends the question + the lecture context to the AI and shows the reply.
//
// "async" because we need to wait for the AI to respond.
// =====================================================================

async function sendChat() {

    // Find the chat input field.
    const input = document.getElementById('chatInput');

    // Read what the user typed and remove surrounding spaces with .trim().
    const question = input.value.trim();

    // If the input is empty, do nothing — just return.
    if (!question) return;

    // Make sure notes have been generated (so lectureContext is set).
    if (!lectureContext) {
        alert('Generate notes first so the AI knows what was taught.');
        return;
    }

    // Make sure we have an API key.
    if (!apiKey) {
        alert('Please save your Anthropic API key first.');
        return;
    }

    // Clear the input box so the user can type the next question.
    input.value = '';

    // Hide the "no messages yet" placeholder text.
    const chatEmpty = document.getElementById('chatEmpty');
    if (chatEmpty) chatEmpty.style.display = 'none';

    // Add the user's message to the chat UI (so they can see it).
    appendMsg('user', 'You', question);

    // Show a "Thinking..." spinner while we wait for the AI.
    // appendLoading() returns an ID so we can remove it later.
    const loadingId = appendLoading();

    // Add the question to our conversation history array.
    // We send the full history to the AI each time so it remembers
    // everything said in this chat session.
    // { role: 'user', content: question } is a JavaScript object.
    chatMessages.push({ role: 'user', content: question });

    // ---------------------------------------------------------------
    // THE SYSTEM PROMPT — this is the "rules" we give the AI
    //
    // A system prompt is a hidden set of instructions sent to the AI
    // before the conversation starts. The user never sees it.
    // It tells the AI how to behave — in this case, act like a professor
    // who only answers questions about what was taught in class.
    //
    // We embed the lectureContext (the transcript) inside the prompt
    // using ${lectureContext} — a template literal.
    // ---------------------------------------------------------------

    const systemPrompt = `You are a helpful professor assistant for a student's revision session.

The student just attended a class. Here is the EXACT transcript of what was taught:
---
${lectureContext}
---

STRICT RULES:
1. Only answer questions that relate to what was taught in the transcript above.
2. If the question is outside the scope of the transcript, respond with:
   "Your professor didn't cover this in today's class — this is outside today's syllabus."
   Then ask: "Would you still like a brief explanation of this topic?"
3. If they say yes or ask the out-of-scope question again, answer it briefly and note it is extra material not from the lecture.
4. Always reference the lecture content in answers, e.g. "As your professor explained..." or "In today's class you learned..."
5. Be encouraging, concise, and study-focused.`;

    // ---------------------------------------------------------------
    // SEND THE MESSAGE TO THE AI API
    // Same fetch() pattern as generateNotes, but this time:
    //   - We include the system prompt (the professor rules)
    //   - We send the full chatMessages history (not just one message)
    //     so the AI remembers the whole conversation
    // ---------------------------------------------------------------

    try {

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,

                // system is separate from messages — it's the AI's "background instructions".
                // The AI reads this before it reads any messages.
                system: systemPrompt,

                // Send the full conversation history, not just the latest message.
                // This is how the AI "remembers" earlier questions in the same session.
                messages: chatMessages
            })
        });

        const data = await response.json();

        // Throw an error if the API returned a problem.
        if (data.error) throw new Error(data.error.message);

        // Extract the AI's reply text.
        const reply = data.content[0].text;

        // Add the AI's reply to our conversation history.
        // Next time the user asks something, we'll send this history again
        // so the AI knows what it already said.
        chatMessages.push({ role: 'assistant', content: reply });

        // Remove the "Thinking..." spinner.
        removeLoading(loadingId);

        // Add the AI's reply to the chat UI.
        appendMsg('ai', 'Professor AI', reply);

    } catch (err) {

        // On error, remove the spinner and show the error as an "AI" message.
        removeLoading(loadingId);
        appendMsg('ai', 'Error', err.message);
    }
}


// =====================================================================
// HELPER FUNCTION: appendMsg
// Adds a single chat message bubble to the chat history on screen.
//
// Parameters:
//   type  = 'user' or 'ai' (used to apply different CSS styles)
//   label = the display name, e.g. 'You' or 'Professor AI'
//   text  = the message content
// =====================================================================

function appendMsg(type, label, text) {

    // Find the chat history container element.
    const history = document.getElementById('chatHistory');

    // Create a brand new <div> element in memory (not yet on screen).
    const div = document.createElement('div');

    // Give it CSS classes: 'vb-msg' always, plus 'user' or 'ai'.
    // CSS uses these classes to style user messages differently from AI messages.
    div.className = 'vb-msg ' + type;

    // A template literal with ${} to insert variables.
    // .replace(/\n/g, '<br>') replaces all newline characters (\n) with
    // HTML line breaks (<br>) so the formatting looks right.
    //   /\n/g is a "regular expression" — \n means newline, g means "all of them"
    div.innerHTML = `
        <div class="vb-msg-label">${label}</div>
        <div class="vb-msg-text">${text.replace(/\n/g, '<br>')}</div>
    `;

    // Add the new div to the end of the chat history container.
    // appendChild puts it at the bottom (most recent message at the bottom).
    history.appendChild(div);

    // Auto-scroll to the bottom so the user always sees the latest message.
    // scrollTop controls the scroll position.
    // scrollHeight is the total height of all the content inside.
    // Setting scrollTop = scrollHeight jumps to the very bottom.
    history.scrollTop = history.scrollHeight;
}


// =====================================================================
// HELPER FUNCTION: appendLoading
// Shows a "Thinking..." spinner in the chat while waiting for the AI.
// Returns a unique ID so we can find and remove it later.
// =====================================================================

function appendLoading() {

    // Create a unique ID for this loading element.
    // ++ before loadingCounter means: add 1 first, THEN use the value.
    // So first call = 'load-1', second = 'load-2', etc.
    const id = 'load-' + (++loadingCounter);

    // Find the chat history container.
    const history = document.getElementById('chatHistory');

    // Create a new div element.
    const div = document.createElement('div');

    // Give it the unique ID so we can find it again to delete it.
    div.id = id;

    // Apply the loading class for CSS styling.
    div.className = 'vb-loading';

    // Put a spinner + text inside.
    div.innerHTML = '<div class="vb-spinner"></div> Thinking...';

    // Add to the chat and scroll down.
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;

    // Return the ID — the caller (sendChat) saves this so it can
    // pass it to removeLoading() when the AI responds.
    return id;
}


// =====================================================================
// HELPER FUNCTION: removeLoading
// Finds and removes the "Thinking..." spinner from the chat.
//
// Parameter:
//   id = the unique ID of the loading element to remove
// =====================================================================

function removeLoading(id) {

    // getElementById finds the element with that specific ID.
    const el = document.getElementById(id);

    // If it exists (it should), remove it from the page.
    // .remove() deletes an element from the DOM (the page's HTML structure).
    if (el) el.remove();
}


// =====================================================================
// EVENT LISTENER: Press Enter to Send Chat
//
// An "event listener" watches for something to happen (an "event")
// and runs a function when it does.
//
// 'DOMContentLoaded' fires when the HTML page has fully loaded.
// We wait for this before trying to find elements, because if we
// run getElementById before the page loads, the element won't exist yet.
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Find the chat input box.
    const chatInput = document.getElementById('chatInput');

    // If it exists, add a keydown listener to it.
    // 'keydown' fires every time the user presses a key.
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {

            // 'e' is the event object — it contains info about which key was pressed.
            // e.key === 'Enter' checks if the pressed key is the Enter key.
            // If yes, call sendChat() — same as clicking the Send button.
            if (e.key === 'Enter') sendChat();
        });
    }
});