# Multi-Tap Text Input Emulator

A nostalgic recreation of the classic multi-tap text input system used on old mobile phones, built with HTML, CSS, and JavaScript.

## Features

- 🌙 **Dark Mode Interface** - Modern dark theme with sleek phone design
- 📱 **Realistic Phone Simulation** - Looks and feels like an old mobile phone
- ⌨️ **Multi-Tap Input** - Press keys multiple times to cycle through letters
- 🔄 **Letter Cycling** - Press same key repeatedly to select different letters
- 💫 **Smooth Animations** - Beautiful transitions and visual feedback
- ⏱️ **Auto-Commit** - Letters are committed after timeout or key change

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Start typing using the number keys (2-9) or click the on-screen buttons

### T9 Key Mapping
- **2**: ABC
- **3**: DEF  
- **4**: GHI
- **5**: JKL
- **6**: MNO
- **7**: PQRS
- **8**: TUV
- **9**: WXYZ
- **0**: Space
- **1**: Toggle 123/ABC mode (for numbers/letters)
- **\***: Punctuation (period)

### Controls
- **Next Button**: Cycle through word suggestions
- **Accept Button**: Accept the current word suggestion
- **⌫ Button**: Backspace/delete
- **Clear Button**: Clear all text

### Keyboard Shortcuts
- **2-9**: Input T9 sequence
- **0 or Space**: Add space
- **Enter**: Accept current word
- **Tab**: Next suggestion
- **Backspace**: Delete
- **Escape**: Clear all

### How Multi-Tap Works
1. Press number keys multiple times to cycle through letters on that key
2. For example, to type "the":
   - Press **8** once for 't' (TUV)
   - Press **4** twice for 'h' (GHI: g→h)
   - Press **3** twice for 'e' (DEF: d→e)
   - Press **0** for space
3. Each key press cycles to the next letter on that key
4. Wait 1 second or press a different key to commit the current letter
5. The current letter being selected is highlighted in blue

### Number Input
- Press **1** to toggle between ABC (letter) and 123 (number) modes
- In 123 mode, keys 2-9 will input actual numbers instead of letters
- The mode indicator shows "123" when in number mode

## Example
Try typing these sequences:
- Press `4-4` `3-3` `5-5-5` `5-5-5` `6-6-6` `0` → "hello "
- Press `8` `4-4` `3-3` `0` → "the "
- Press `2` `6-6-6` `3-3` `0` → "and "

Note: Each number represents a key press, dashes show multiple presses of the same key.

## Technical Details

### Files
- `index.html` - Main HTML structure
- `style.css` - Dark mode styling and phone design
- `script.js` - T9 logic and interaction handling

### Dictionary
The emulator includes a basic dictionary of common English words. In a real implementation, this would be much larger and could include:
- Personal contacts
- Recently used words
- User-added words
- Multiple languages

## Browser Compatibility
Works in all modern browsers that support:
- ES6 Classes
- CSS Grid
- CSS Flexbox
- Modern JavaScript features

## Customization
You can easily customize:
- Dictionary words (edit the `dictionary` array in `script.js`)
- Color scheme (modify CSS variables in `style.css`)
- Key layout (adjust the HTML structure in `index.html`)
- Animation timing (change CSS animation durations)

Enjoy this nostalgic trip back to the early days of mobile texting! 📱✨ 