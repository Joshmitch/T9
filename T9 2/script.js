class MultiTapEmulator {
    constructor() {
        this.keyMapping = {
            '2': 'abc2',
            '3': 'def3',
            '4': 'ghi4',
            '5': 'jkl5',
            '6': 'mno6',
            '7': 'pqrs7',
            '8': 'tuv8',
            '9': 'wxyz9'
        };

        this.currentText = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        this.currentLetter = '';
        this.lastKeyTime = 0;
        this.keyTimeout = null;
        this.timeoutDuration = 1000; // 1 second timeout between key presses
        this.numberMode = false;
        this.shiftMode = false; // Single letter capitalization
        this.capsLockMode = false; // All letters capitalized
        this.lastHashTime = 0; // For detecting double # press
        this.longPressTimer = null; // For long press detection
        this.longPressDuration = 800; // 800ms for long press
        this.messageTimeout = null; // For message timeout
        this.keyboardLongPressTimer = null; // For keyboard long press detection
        this.isTypingActive = false; // Track if typing indicator is active

        // Array of 50 different "no" responses
        this.noResponses = [
            "Srsly? Total miss.",
            "Wrng. Try hrdr.",
            "Failed agn, genius.",
            "Denied! Wake up!",
            "Not even close, amtr.",
            "Thats wrng, obv.",
            "Access denied. Agn.",
            "Nt even warm!",
            "Wow, pathetic atmpt.",
            "Nope! Swng n miss.",
            "Denied. Weak sauce.",
            "Wrng. Step it up.",
            "Nice try, failure.",
            "Incrrct, predictably.",
            "Way off. Try hrdr.",
            "Gsswrk isnt ur forte.",
            "Thats just sad.",
            "Almst? Nt rly.",
            "No entry, brainiac.",
            "Wrng key, try agn.",
            "Laughably wrng.",
            "Missed by mile.",
            "Incrrct. Agn.",
            "Blckd. Impress me.",
            "Swng n a miss.",
            "Strike 2, buddy.",
            "Not even n ballpark.",
            "That was pitiful.",
            "Pathetic gss. Agn?",
            "Ur not even close.",
            "Fail. Try agn.",
            "No, try agn, genius.",
            "Wrng. Clearly.",
            "Denied. Up ur game.",
            "Still wrng. Duh.",
            "Access fumbled.",
            "Nope. Keep gssing.",
            "Psswrd rejected.",
            "Locked out. Shockr.",
            "Thats a no-go.",
            "Gsswrk fail.",
            "Close? Nt even.",
            "U call that a try?",
            "Weak atmpt. Agn.",
            "Laughably incrrct.",
            "No joy there.",
            "Thats a no.",
            "Error! Gss agn.",
            "Try agn, rookie.",
            "Denying entry. Agn."
        ];
        
        // Track used responses
        this.usedResponses = [];
        
        // Array of 50 empty message responses
        this.emptyResponses = [
            "Well, it cant b empty!",
            "Cm on, type smthng!",
            "Blanks nt gonna cut it.",
            "Nthng there! Try typing?",
            "Need more thn silence.",
            "U forgot 2 type!",
            "Cnt process empty space.",
            "Air doesnt count, buddy.",
            "Gonna need actual txt.",
            "Invisible ink? Try agn.",
            "Void doesnt unlock doors.",
            "Zero input, zero access.",
            "Space still nuthing.",
            "Thoughts work when typed.",
            "Txt smthng, anythng!",
            "Blank? Srsly?",
            "Psswrd cant b nada.",
            "Need wrds, nt vibes.",
            "Pressing send wont cut it.",
            "Looks like u forgot smthng.",
            "No msg, no entry.",
            "U left it blank!",
            "Gotta write more thn that.",
            "Typed nuthing n pressed send?",
            "Write smthng nxt time!",
            "Entry needs sm txt.",
            "Cnt move fwd like this.",
            "Txt field is bare!",
            "Needs more thn air.",
            "Put a wrd or 3 there.",
            "Empty space wont open doors.",
            "Type b4 hitting send.",
            "Void entries dnt count.",
            "Pen ur thoughts 1st!",
            "Idea, formatted plz.",
            "Blank pages dnt flip.",
            "U sent...nuthing.",
            "Try adding chars.",
            "Empty thought, empty result.",
            "White space wont work.",
            "Lets see sm words!",
            "Silent treatment wont help.",
            "Need an actual atmpt!",
            "Stop pressing send on blank!",
            "Fill it in 1st, plz.",
            "Msg box needs content.",
            "U missed a crucial step!",
            "Guess we need words here.",
            "Silent psswrds dnt exist.",
            "Make sure 2 type, then send."
        ];
        
        // Track used empty responses
        this.usedEmptyResponses = [];

        // Add emojis to random replies
        this.addEmojisToReplies();

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateModeDisplay();
        
        // Show intro sequence when page loads
        this.showIntroSequence();
    }

    addEmojisToReplies() {
        // List of emojis to add
        const emojis = [":)", ":(", ":D", ":P", ";-)", ":O", ":/", ":|", ":3", ":'(", ":*", "_", "-_-", "_<", "o_O"];
        
        // Combine both arrays to get all possible replies
        const allReplies = [...this.noResponses, ...this.emptyResponses];
        
        // Randomly select 15 indices from the combined array
        const selectedIndices = [];
        while (selectedIndices.length < 15) {
            const randomIndex = Math.floor(Math.random() * allReplies.length);
            if (!selectedIndices.includes(randomIndex)) {
                selectedIndices.push(randomIndex);
            }
        }
        
        // Add emojis to selected replies
        selectedIndices.forEach((index, emojiIndex) => {
            if (index < this.noResponses.length) {
                // It's in noResponses array
                this.noResponses[index] += " " + emojis[emojiIndex];
            } else {
                // It's in emptyResponses array
                const emptyIndex = index - this.noResponses.length;
                this.emptyResponses[emptyIndex] += " " + emojis[emojiIndex];
            }
        });
    }

    initializeElements() {
        this.textArea = document.getElementById('textArea');
        this.suggestions = document.getElementById('suggestions');
        this.keys = document.querySelectorAll('.key');
        this.fullWidthSend = document.getElementById('fullWidthSend');
        this.messageLog = document.getElementById('messageLog');
    }

    bindEvents() {
        this.keys.forEach(key => {
            key.addEventListener('mousedown', (e) => this.handleKeyDown(key, e));
            key.addEventListener('mouseup', (e) => this.handleKeyUp(key, e));
            key.addEventListener('mouseleave', (e) => this.handleKeyLeave(key, e));
            key.addEventListener('touchstart', (e) => this.handleKeyDown(key, e));
            key.addEventListener('touchend', (e) => this.handleKeyUp(key, e));
        });

        // Full-width send button event
        if (this.fullWidthSend) {
            this.fullWidthSend.addEventListener('click', (e) => {
                // Only handle click if not typing
                if (!this.isTypingActive) {
                    this.handleSendButton(e);
                }
            });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboardDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyboardUp(e));
    }

    handleKeyDown(keyElement, event) {
        event.preventDefault();
        const key = keyElement.dataset.key;
        
        // Add visual feedback
        keyElement.classList.add('key-pressed');
        
        // Handle long press for key "1" only
        if (key === '1') {
            this.longPressTimer = setTimeout(() => {
                this.clearAll();
                // Remove visual feedback after clear
                keyElement.classList.remove('key-pressed');
                this.longPressTimer = null;
            }, this.longPressDuration);
        }
    }

    handleKeyUp(keyElement, event) {
        event.preventDefault();
        const key = keyElement.dataset.key;
        const letters = keyElement.dataset.letters;

        // Remove visual feedback
        keyElement.classList.remove('key-pressed');

        // Only handle input if we actually pressed down on this key
        if (key === '1') {
            // If long press timer is still running, it's a short press
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
                this.backspace(); // Short press = backspace
            }
            // If timer is null, long press already executed, do nothing
        } else {
            // For all other keys, handle normally
            this.handleRegularKeyPress(key, letters);
        }
    }

    handleKeyLeave(keyElement, event) {
        // If mouse leaves the key, cancel any pending actions
        keyElement.classList.remove('key-pressed');
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    handleRegularKeyPress(key, letters) {
        if (key === '0') {
            this.addSpace();
        } else if (key === '*') {
            this.addPunctuation();
        } else if (key === '#') {
            this.handleShiftKey();
        } else if (letters) {
            if (this.numberMode) {
                this.addNumber(key);
            } else {
                this.handleMultiTap(key);
            }
        }
    }

    handleKeyboardDown(e) {
        // Prevent key repeat from triggering multiple times
        if (e.repeat) return;
        
        const key = e.key;
        
        if (key >= '2' && key <= '9') {
            e.preventDefault();
            this.showKeyDown(key);
            if (this.numberMode) {
                this.addNumber(key);
            } else {
                this.handleMultiTap(key);
            }
        } else if (key === '1') {
            e.preventDefault();
            this.showKeyDown('1');
            
            // Start long press timer for clear all (same as UI)
            this.keyboardLongPressTimer = setTimeout(() => {
                this.clearAll();
                this.keyboardLongPressTimer = null;
            }, this.longPressDuration);
            
            this.backspace();
        } else if (key === '*') {
            e.preventDefault();
            this.showKeyDown('*');
            this.addPunctuation();
        } else if (key === '#') {
            e.preventDefault();
            this.showKeyDown('#');
            this.handleShiftKey();
        } else if (key === '0' || key === ' ') {
            e.preventDefault();
            this.showKeyDown('0');
            this.addSpace();
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.showKeyDown('1'); // Backspace maps to key 1
            this.backspace();
        } else if (key === 'Enter') {
            e.preventDefault();
            // Only show visual feedback if not typing
            if (!this.isTypingActive) {
                this.showKeyDown('send'); // Show send button pressed state
                this.handleSendButton(e);
            }
        }
    }

    handleKeyboardUp(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.showKeyUp(key);
        } else if (key === '*') {
            this.showKeyUp('*');
        } else if (key === '#') {
            this.showKeyUp('#');
        } else if (key === ' ') {
            this.showKeyUp('0');
        } else if (key === 'Backspace') {
            this.showKeyUp('1'); // Backspace maps to key 1
        } else if (key === 'Enter') {
            // Only show visual feedback if not typing
            if (!this.isTypingActive) {
                this.showKeyUp('send'); // Show send button released state
            }
        }
        
        // Special handling for key "1" - cancel long press if released early
        if (key === '1' && this.keyboardLongPressTimer) {
            clearTimeout(this.keyboardLongPressTimer);
            this.keyboardLongPressTimer = null;
        }
    }

    showKeyDown(keyValue) {
        // Find the corresponding key element
        const keyElement = document.querySelector(`[data-key="${keyValue}"]`);
        if (keyElement) {
            // Add pressed state (replicates :active state)
            keyElement.classList.add('key-pressed');
        }
    }

    showKeyUp(keyValue) {
        // Find the corresponding key element
        const keyElement = document.querySelector(`[data-key="${keyValue}"]`);
        if (keyElement) {
            // Remove pressed state
            keyElement.classList.remove('key-pressed');
        }
    }

    showKeyPress(keyValue) {
        // For backwards compatibility with mouse/touch events
        this.showKeyDown(keyValue);
        setTimeout(() => {
            this.showKeyUp(keyValue);
        }, 150);
    }

    handleMultiTap(key) {
        const currentTime = Date.now();
        
        // If same key pressed within timeout, cycle to next letter
        if (this.currentKey === key && (currentTime - this.lastKeyTime) < this.timeoutDuration) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keyMapping[key].length;
            this.currentLetter = this.keyMapping[key][this.currentKeyIndex];
        } else {
            // New key or timeout expired - commit previous letter and start new one
            if (this.currentLetter) {
                this.commitCurrentLetter();
            }
            this.currentKey = key;
            this.currentKeyIndex = 0;
            this.currentLetter = this.keyMapping[key][0];
        }
        
        this.lastKeyTime = currentTime;
        this.updateDisplay();
        
        // Set timeout to commit current letter
        clearTimeout(this.keyTimeout);
        this.keyTimeout = setTimeout(() => {
            this.commitCurrentLetter();
        }, this.timeoutDuration);
    }

    commitCurrentLetter() {
        if (this.currentLetter) {
            let letterToAdd = this.currentLetter;
            
            // Apply capitalization logic
            if (this.shiftMode || this.capsLockMode) {
                letterToAdd = letterToAdd.toUpperCase();
                // Reset shift mode after single letter (but not caps lock)
                if (this.shiftMode) {
                    this.shiftMode = false;
                    this.updateModeDisplay();
                }
            }
            
            this.currentText += letterToAdd;
            this.currentLetter = '';
            this.currentKey = null;
            this.currentKeyIndex = 0;
            this.updateDisplay();
        }
    }

    handleShiftKey() {
        const currentTime = Date.now();
        const doubleClickTime = 500; // 500ms for double-click detection
        
        // If caps lock is already on, single click turns it off
        if (this.capsLockMode) {
            this.capsLockMode = false;
            this.shiftMode = false;
        } else {
            // Check if this is a double press (enable caps lock)
            if (currentTime - this.lastHashTime < doubleClickTime) {
                this.capsLockMode = true;
                this.shiftMode = false; // Clear shift mode when enabling caps lock
            } else {
                // Single press - toggle shift mode
                this.shiftMode = !this.shiftMode;
            }
        }
        
        this.lastHashTime = currentTime;
        this.updateModeDisplay();
    }

    addSpace() {
        // Commit current letter if typing
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
        this.currentText += ' ';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentLetter) {
            // Clear current letter being typed
            this.currentLetter = '';
            this.currentKey = null;
            this.currentKeyIndex = 0;
            clearTimeout(this.keyTimeout);
        } else {
            // Delete last character from text
            this.currentText = this.currentText.slice(0, -1);
        }
        this.updateDisplay();
    }

    clearAll() {
        this.currentText = '';
        this.currentLetter = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        this.shiftMode = false;
        this.capsLockMode = false;
        this.numberMode = false;
        this.updateDisplay();
        this.updateModeDisplay();
        clearTimeout(this.keyTimeout);
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
    }

    toggleNumberMode() {
        this.numberMode = !this.numberMode;
        // Reset shift states when switching to number mode
        if (this.numberMode) {
            this.shiftMode = false;
            this.capsLockMode = false;
        }
        this.updateModeDisplay();
        // Commit current letter if switching modes
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
    }

    addNumber(key) {
        this.currentText += key;
        this.updateDisplay();
    }

    addPunctuation() {
        const punctuation = ['.', ',', '?', '!', ';', ':', '-', '(', ')'];
        // For simplicity, just add a period. In a real T9, this would cycle through punctuation
        this.currentText += '.';
        this.updateDisplay();
    }

    updateModeDisplay() {
        const screen = document.querySelector('.screen');
        let modeIndicator = screen.querySelector('.mode-indicator');
        
        if (!modeIndicator) {
            modeIndicator = document.createElement('div');
            modeIndicator.className = 'mode-indicator';
            modeIndicator.style.cssText = `
                position: absolute;
                top: 5px;
                right: 8px;
                font-size: 9px;
                color: #1a202c;
                background: rgba(26, 32, 44, 0.1);
                padding: 1px 4px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            `;
            screen.appendChild(modeIndicator);
        }
        
        let modeText = '';
        if (this.numberMode) {
            modeText = '123';
        } else if (this.capsLockMode) {
            modeText = 'CAPS';
        } else if (this.shiftMode) {
            modeText = 'SHIFT';
        }
        
        modeIndicator.textContent = modeText;
        modeIndicator.style.display = (this.numberMode || this.capsLockMode || this.shiftMode) ? 'block' : 'none';
    }

    updateDisplay() {
        // Update text area
        let displayText = this.currentText;
        if (this.currentLetter) {
            let displayLetter = this.currentLetter;
            // Show uppercase if shift or caps lock is active
            if (this.shiftMode || this.capsLockMode) {
                displayLetter = displayLetter.toUpperCase();
            }
            displayText += `<span style="background: rgba(0, 0, 0, 0.2); box-decoration-break: clone;">${displayLetter}</span>`;
        } else {
            // Show blinking cursor when not typing (even if text is empty)
            displayText += '<span class="cursor"></span>';
        }
        this.textArea.innerHTML = displayText;

        // Clear suggestions area for multi-tap (no suggestions needed)
        this.suggestions.innerHTML = '';


    }

    showCurrentLetter() {
        // Show current letter on the pressed key
        if (!this.currentKey) return;
        
        const keyElement = document.querySelector(`[data-key="${this.currentKey}"]`);
        if (keyElement) {
            const existingLetter = keyElement.querySelector('.current-letter');
            if (existingLetter) existingLetter.remove();

            const letterElement = document.createElement('div');
            letterElement.className = 'current-letter';
            letterElement.textContent = this.currentLetter;
            letterElement.style.cssText = `
                position: absolute;
                bottom: 3px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #1a202c;
                background: rgba(26, 32, 44, 0.2);
                padding: 1px 4px;
                border-radius: 8px;
                font-weight: bold;
                font-family: 'Courier New', monospace;
            `;
            keyElement.appendChild(letterElement);

            setTimeout(() => {
                if (letterElement.parentNode) {
                    letterElement.remove();
                }
            }, this.timeoutDuration + 100);
        }
    }

    handleSendButton(event) {
        event.preventDefault();
        
        // Block sending if typing indicator is active
        if (this.isTypingActive) {
            return;
        }
        
        // Commit any current letter being typed
        if (this.currentLetter) {
            this.commitCurrentLetter();
        }
        
        // Get the current text and trim whitespace
        const currentText = this.currentText.trim();
        
        // Check if message is empty
        if (currentText === '') {
            // Don't add empty message to log, just show empty response
            setTimeout(() => {
                // Pre-fetch empty reply and measure size
                const emptyReply = this.getNextEmptyResponse();
                const { targetWidth, timestamp } = this.measureReplySize(emptyReply);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, emptyReply, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, emptyReply, targetWidth, timestamp);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms before responding
            return; // Exit early for empty messages
        }
        
        // Add the message to the log
        this.addMessageToLog(currentText);
        
        // Clear the phone screen
        this.currentText = '';
        this.currentLetter = '';
        this.currentKey = null;
        this.currentKeyIndex = 0;
        clearTimeout(this.keyTimeout);
        this.updateDisplay();
        
        // Check if the text is "skate" (case insensitive) and send reply
        // Wait for message animation to complete (400ms) plus a small buffer
        if (currentText.toLowerCase() === 'skate') {
            setTimeout(() => {
                // Pre-fetch reply and measure size
                const replyText = 'Correct';
                const { targetWidth, timestamp } = this.measureReplySize(replyText);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, replyText, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp);
                    // Open gangworld.net in a new tab after 2 seconds
                    setTimeout(() => {
                        window.open('https://gangworld.net', '_blank');
                    }, 2000);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms for message animation to finish
        } else {
            setTimeout(() => {
                // Pre-fetch reply and measure size
                const replyText = this.getNextNoResponse();
                const { targetWidth, timestamp } = this.measureReplySize(replyText);
                
                // Show typing indicator with pre-calculated size
                const typingBubble = this.addTypingIndicator(targetWidth, replyText, timestamp);
                
                // After typing delay, replace with actual reply
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp);
                }, 2000); // Show typing for 2 seconds
            }, 500); // Wait 500ms for message animation to finish
        }
    }

    addMessageToLog(message) {
        if (!message) return; // Don't log empty messages
        
        // Show the message log if it's hidden
        this.messageLog.style.display = 'flex';
        
        // Messages will naturally move down smoothly due to CSS transitions
        
        // Create message element
        const messageItem = document.createElement('div');
        const rotationClass = Math.random() < 0.5 ? 'rotate-left' : 'rotate-right';
        messageItem.className = `message-item ${rotationClass} entrance`;
        
        // Create timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Create content
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = message;
        
        messageItem.appendChild(timestamp);
        messageItem.appendChild(content);
        
        // Insert at the top
        this.messageLog.insertBefore(messageItem, this.messageLog.firstChild);
        
        // Remove entrance class after animation completes
        setTimeout(() => {
            messageItem.classList.remove('entrance');
        }, 400);
        
        // Keep all messages for full history - no deletion
    }

    addReplyToLog(replyText) {
        // Show the message log if it's hidden
        this.messageLog.style.display = 'flex';
        
        // Messages will naturally move down smoothly due to CSS transitions
        
        // Create reply element
        const replyItem = document.createElement('div');
        const rotationClass = Math.random() < 0.5 ? 'rotate-left' : 'rotate-right';
        replyItem.className = `reply-item ${rotationClass} entrance`;
        
        // Create timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        
        // Create content
        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = replyText;
        
        replyItem.appendChild(timestamp);
        replyItem.appendChild(content);
        
        // Insert at the top
        this.messageLog.insertBefore(replyItem, this.messageLog.firstChild);
        
        // Remove entrance class after animation completes
        setTimeout(() => {
            replyItem.classList.remove('entrance');
        }, 400);
        
        // Keep all messages for full history - no deletion
    }

    measureReplySize(replyText) {
        // Create a temporary invisible element to measure target size
        const tempBubble = document.createElement('div');
        tempBubble.className = 'reply-item';
        tempBubble.style.visibility = 'hidden';
        tempBubble.style.position = 'absolute';
        tempBubble.style.top = '-9999px';
        tempBubble.style.maxWidth = '85%';
        
        // Create temp content to measure
        const tempTimestamp = document.createElement('div');
        tempTimestamp.className = 'timestamp';
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        tempTimestamp.textContent = timestamp;
        
        const tempContent = document.createElement('div');
        tempContent.className = 'content';
        tempContent.textContent = replyText;
        
        tempBubble.appendChild(tempTimestamp);
        tempBubble.appendChild(tempContent);
        document.body.appendChild(tempBubble);
        
        const targetWidth = tempBubble.offsetWidth;
        document.body.removeChild(tempBubble);
        
        return { targetWidth, timestamp };
    }

    addTypingIndicator(targetWidth, replyText, timestamp) {
        // Show the message log if it's hidden
        this.messageLog.style.display = 'flex';
        
        // Create typing bubble
        const typingBubble = document.createElement('div');
        const rotationClass = Math.random() < 0.5 ? 'rotate-left' : 'rotate-right';
        typingBubble.className = `typing-bubble ${rotationClass}`;
        
        // Store pre-calculated data for smooth morphing
        typingBubble.dataset.targetWidth = targetWidth;
        typingBubble.dataset.replyText = replyText;
        typingBubble.dataset.timestamp = timestamp;
        
        // Create typing dots
        const typingDots = document.createElement('div');
        typingDots.className = 'typing-dots';
        
        // Add three dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDots.appendChild(dot);
        }
        
        typingBubble.appendChild(typingDots);
        
        // Insert at the top
        this.messageLog.insertBefore(typingBubble, this.messageLog.firstChild);
        
        // Set typing active flag
        this.isTypingActive = true;
        
        return typingBubble;
    }

    replaceTypingWithReply(typingBubble, replyText, targetWidth, timestamp) {
        const rotationClass = typingBubble.classList.contains('rotate-left') ? 'rotate-left' : 'rotate-right';
        
        // Step 1: Use pre-calculated measurements for smooth transition
        const currentWidth = typingBubble.offsetWidth;
        typingBubble.style.width = currentWidth + 'px';
        
        // Step 2: Start morphing - fade out dots and begin size transition
        const typingDots = typingBubble.querySelector('.typing-dots');
        if (typingDots) {
            typingDots.classList.add('fade-out');
        }
        typingBubble.classList.add('morphing');
        
        // Animate to pre-calculated target width immediately
        setTimeout(() => {
            typingBubble.style.width = targetWidth + 'px';
        }, 100);
        
        // Step 3: After dots fade out, create reply content (hidden initially)
        setTimeout(() => {
            // Clear content but keep the bubble
            typingBubble.innerHTML = '';
            
            // Create reply content container
            const replyContentDiv = document.createElement('div');
            replyContentDiv.className = 'reply-content';
            
            // Create timestamp using pre-calculated value
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
            timestampDiv.textContent = timestamp;
            
            // Create content
            const content = document.createElement('div');
            content.className = 'content';
            content.textContent = replyText;
            
            replyContentDiv.appendChild(timestampDiv);
            replyContentDiv.appendChild(content);
            typingBubble.appendChild(replyContentDiv);
            
            // Step 4: Complete the transformation
            typingBubble.className = `reply-item ${rotationClass}`;
            typingBubble.style.width = 'auto'; // Remove fixed width
            
            // Step 5: Fade in the reply content
            setTimeout(() => {
                replyContentDiv.classList.add('fade-in');
                
                // Clear typing active flag when reply is fully visible
                this.isTypingActive = false;
            }, 50);
            
        }, 400); // Wait for dots to fade out and size to adjust
        
        // Keep all messages for full history - no deletion
    }

    getNextNoResponse() {
        // If we've used all responses, reset the used array
        if (this.usedResponses.length >= this.noResponses.length) {
            this.usedResponses = [];
        }
        
        // Find an unused response
        let availableResponses = this.noResponses.filter(response => 
            !this.usedResponses.includes(response)
        );
        
        // Pick a random response from available ones
        const randomIndex = Math.floor(Math.random() * availableResponses.length);
        const selectedResponse = availableResponses[randomIndex];
        
        // Mark it as used
        this.usedResponses.push(selectedResponse);
        
        return selectedResponse;
    }

    getNextEmptyResponse() {
        // If we've used all empty responses, reset the used array
        if (this.usedEmptyResponses.length >= this.emptyResponses.length) {
            this.usedEmptyResponses = [];
        }
        
        // Find an unused empty response
        let availableResponses = this.emptyResponses.filter(response => 
            !this.usedEmptyResponses.includes(response)
        );
        
        // Pick a random response from available ones
        const randomIndex = Math.floor(Math.random() * availableResponses.length);
        const selectedResponse = availableResponses[randomIndex];
        
        // Mark it as used
        this.usedEmptyResponses.push(selectedResponse);
        
        return selectedResponse;
    }

    showIntroSequence() {
        // Show message log
        this.messageLog.style.display = 'flex';
        
        // Message 1: "Yo"
        const message1 = "Yo";
        const { targetWidth: width1, timestamp: timestamp1 } = this.measureReplySize(message1);
        const typingBubble1 = this.addTypingIndicator(width1, message1, timestamp1);
        
        setTimeout(() => {
            this.replaceTypingWithReply(typingBubble1, message1, width1, timestamp1);
            
            // Message 2: "Bet u cant guess da psswrd" after a longer pause
            setTimeout(() => {
                const message2 = "Bet u cant guess da psswrd";
                const { targetWidth: width2, timestamp: timestamp2 } = this.measureReplySize(message2);
                const typingBubble2 = this.addTypingIndicator(width2, message2, timestamp2);
                
                setTimeout(() => {
                    this.replaceTypingWithReply(typingBubble2, message2, width2, timestamp2);
                    
                    // Message 3: "If u can i have a gift 4 u" after another longer pause
                    setTimeout(() => {
                        const message3 = "If u can i have a gift 4 u";
                        const { targetWidth: width3, timestamp: timestamp3 } = this.measureReplySize(message3);
                        const typingBubble3 = this.addTypingIndicator(width3, message3, timestamp3);
                        
                        setTimeout(() => {
                            this.replaceTypingWithReply(typingBubble3, message3, width3, timestamp3);
                            
                            // Show the phone after all messages appear with a much larger delay
                            setTimeout(() => {
                                const phoneContainer = document.querySelector('.phone-container');
                                phoneContainer.classList.remove('hidden');
                                phoneContainer.classList.add('show');
                                
                                // Message 4: "Txt me your guesses" after phone appears
                                setTimeout(() => {
                                    const message4 = "Txt me your guesses";
                                    const { targetWidth: width4, timestamp: timestamp4 } = this.measureReplySize(message4);
                                    const typingBubble4 = this.addTypingIndicator(width4, message4, timestamp4);
                                    
                                    setTimeout(() => {
                                        this.replaceTypingWithReply(typingBubble4, message4, width4, timestamp4);
                                    }, 2000); // Typing time for message 4
                                }, 1000); // Short pause after phone appears
                            }, 3000); // Much longer wait before phone appears
                        }, 2000); // Typing time for message 3
                    }, 1500); // Longer pause between message 2 and typing for message 3
                }, 2000); // Typing time for message 2
            }, 1500); // Longer pause between message 1 and typing for message 2
        }, 1500); // Typing time for message 1 (shorter since it's just "Yo")
    }

}

// Initialize the Multi-Tap emulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.multiTapEmulator = new MultiTapEmulator();
    
    // Add mouse tracking for 3D phone movement
    const phone = document.querySelector('.phone');
    const phoneContainer = document.querySelector('.phone-container');
    
    if (phone && phoneContainer) {
        phoneContainer.addEventListener('mousemove', (e) => {
            // Don't track mouse movement if hovering over the full-width send button
            if (e.target.closest('.full-width-button')) {
                return;
            }
            
            const rect = phoneContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);
            
            // Apply transforms based on mouse position
            const rotateY = mouseX * 5; // Max 5 degrees left/right
            const rotateX = -mouseY * 3; // Max 3 degrees up/down (inverted)
            
            phone.style.transform = `rotateX(${5 + rotateX}deg) rotateY(${-2 + rotateY}deg)`;
        });
        
        phoneContainer.addEventListener('mouseleave', () => {
            // Return to default position when mouse leaves
            phone.style.transform = 'rotateX(5deg) rotateY(-2deg)';
        });
    }
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add phone brand/model display
    const phone = document.querySelector('.phone');
    const brand = document.createElement('div');
    brand.innerHTML = '<div style="text-align: center; color: #cbd5e0; font-size: 11px; margin-bottom: 15px; font-family: monospace;">JOSHIA 3310</div>';
    phone.insertBefore(brand, phone.firstChild);
    
    // Add subtle animations
    const keys = document.querySelectorAll('.key');
    keys.forEach((key, index) => {
        key.style.animationDelay = `${index * 0.05}s`;
        key.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});

// CSS animation for key fade-in (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 