// רשימת הערכים שיצרו Sections
const values = [
    { title: "ערך 1", description: "זהו תיאור עבור ערך 1.", image: "https://via.placeholder.com/300" },
    { title: "ערך 2", description: "זהו תיאור עבור ערך 2.", image: "https://via.placeholder.com/300" },
    { title: "ערך 3", description: "זהו תיאור עבור ערך 3.", image: "https://via.placeholder.com/300" },
    { title: "ערך 4", description: "זהו תיאור עבור ערך 3.", image: "https://via.placeholder.com/300" },
    { title: "ערך 5", description: "זהו תיאור עבור ערך 3.", image: "https://via.placeholder.com/300" },
    { title: "ערך 6", description: "זהו תיאור עבור ערך 3.", image: "https://via.placeholder.com/300" }

];



/**
 * פונקציה ליצירת כפתור דינמי בתפריט הניווט הישן
 * @param {string} sectionId - מזהה ה- section
 * @param {string} title - הכותרת שתוצג מעל התפריט החדש
 */
function createNavButton(sectionId, title,displayText) {
    const button = document.createElement("li");
    const link = document.createElement("a");

    link.href = "#";
    link.textContent = title;
    link.onclick = function () {
        navigateToSection(sectionId);
        /*updateDynamicTitle(displayText);*/
    };

    button.appendChild(link);
    return button;
}

/**
 * פונקציה שמכניסה את הכפתורים הדינמיים לניווט הישן
 */
function loadNavButtons() {
    const navContainer = document.getElementById("nav-buttons-container");
    navButtons.forEach(({ sectionId, title ,displayText}) => {
        navContainer.appendChild(createNavButton(sectionId, title,displayText));
    });
}
function navigateToSection(sectionId) {
    document.querySelectorAll(".main-content section").forEach(section => {
        section.style.display = "none";
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = "block";
    }
}


class KSageCell {
    constructor(inputSelector, outputSelector, codeSelector, evalButtonId,autoEval) {
        this.inputDiv = document.querySelector(inputSelector);
        this.outputDiv = document.querySelector(outputSelector);
        this.codeElement = document.querySelector(codeSelector);
        this.evalButtonId = evalButtonId || `sage-eval-button-${Math.random().toString(36).substr(2, 9)}`;

        if (!this.inputDiv || !this.outputDiv || !this.codeElement) {
            console.error("❌ שגיאה: אחד האלמנטים לא נמצא!", { inputSelector, outputSelector, codeSelector });
            return;
        }

        this.scriptTag = document.createElement("script");
        this.scriptTag.type = "text/x-sage";
        this.scriptTag.textContent = this.codeElement.textContent.trim();

        this.evalButton = document.createElement("button");
        this.evalButton.id = this.evalButtonId;
        this.evalButton.textContent = "הרץ חישוב";
        this.evalButton.style.marginTop = "10px";

        this.inputDiv.appendChild(this.scriptTag);
        this.outputDiv.appendChild(this.evalButton);
        this.outputDiv.parentNode.insertBefore(this.evalButton, this.outputDiv);

        this.cell = this.createSageCell();

        this.evalButton.addEventListener("click", () => {
            if (this.cell) {
                this.startProcessing();
                let evalBtn = this.inputDiv.querySelector(".sagecell_evalButton");
                if (evalBtn) {
                    evalBtn.click();
                    this.observeProcessing();
                    this.observeOutput();
                } else {
                    console.error("❌ כפתור ההערכה של SageMathCell לא נמצא.");
                }
            } else {
                console.error("❌ לא ניתן להפעיל את החישוב - תא SageMath לא אותחל כראוי.");
            }
        });
    }

    createSageCell() {
        return sagecell.makeSagecell({
            inputLocation: this.inputDiv,
            outputLocation: this.outputDiv,
            autoEval:this.autoEval,
            evalButton: `#${this.evalButtonId}`,
            evalButtonText: "חשב",
            hide: ["permalink", "sessionFiles", "evalButton"],
            linkKey: 'Quiz1'
        });
    }

    startProcessing() {
        this.evalButton.textContent = "⏳ מחשב...";
        this.evalButton.style.backgroundColor = "orange";
        this.evalButton.style.color = "black";
    }

    observeProcessing() {
        const observer = new MutationObserver(() => {
            if (!this.inputDiv.classList.contains("sagecell_processing")) {
                this.finishProcessing();
                observer.disconnect();
            }
        });
        observer.observe(this.inputDiv, { attributes: true, attributeFilter: ["class"] });
    }

    observeOutput() {
        const observer = new MutationObserver(() => {
            this.finishProcessing();
            observer.disconnect();
        });
        observer.observe(this.outputDiv, { childList: true, subtree: true });
    }

    finishProcessing() {
        setTimeout(() => {
            this.evalButton.textContent = "✅ החישוב הושלם!";
            this.evalButton.style.backgroundColor = "green";
            this.evalButton.style.color = "white";
        }, 500);
    }
}


class KSageBlock {
    constructor(inputSelectors, outputSelectors, codeSelectors, codes, autoEval = false) {
        if (inputSelectors.length !== codes.length || outputSelectors.length !== codes.length || codeSelectors.length !== codes.length) {
            console.error("❌ יש להעביר את אותו מספר מזהים לכל רשימה (input, output, code) וכן קטעי קוד תואמים");
            console.error(inputSelectors)
            return;
        }

        this.cells = [];
        for (let i = 0; i < codes.length; i++) {
            const cell = new KSageCell(inputSelectors[i], outputSelectors[i], codeSelectors[i], null, autoEval);
            cell.codeElement.textContent = codes[i];
            this.cells.push(cell);
        }
    }
}

function loadSections() {
    const container = document.getElementById("main-contentid");
    const navContainer = document.getElementById("nav-buttons-container");

    let inputSelectors = [];
    let outputSelectors = [];
    let codeSelectors = [];
    let codes = [];

    let bla = ["funcA", "funcB", "funcC", "funcD", "funcE", "funcF"];

    function funcA() { return "a"; }
    function funcB() { return "b"; }
    function funcC() { return "c"; }
    function funcD() { return "d"; }
    function funcE() { return "e"; }
    function funcF() { return "f"; }

    values.forEach((item, index) => {
        let section = document.createElement("section");
        let sectionId = "section-" + (index + 1);
        section.id = sectionId;
        section.style.display = "none";

        let title = document.createElement("h2");
        title.textContent = item.title;

        let description = document.createElement("p");
        description.textContent = item.description;

        let button = document.createElement("button");
        button.textContent = "לקרוא עוד";
        button.onclick = function() {
            alert("אתה לוחץ על כפתור לקרוא עוד עבור: " + item.title);
        };

        let inputId = "input-" + (index + 1);
        let outputId = "output-" + (index + 1);
        let codeId = "code-" + (index + 1);

        let inputDiv = document.createElement("div");
        inputDiv.id = inputId;

        let outputDiv = document.createElement("div");
        outputDiv.id = outputId;

        let codeElement = document.createElement("pre");
        codeElement.id = codeId;
        for (let i = 0; i < 5; i++) {
            inputId="input-question-" + (index + 1)+ "-"+ str(i+1);
            inputSelectors.push("#" + inputId);
            outputId="output-question-" + (index + 1)+ "-"+ str(i+1);
            inputSelectors.push("#" + outputId);
            codetId="code-question-" + (index + 1)+ "-"+ str(i+1);
            codeSelectors.push("#" + codeId);
            codes.push("Q[" + index + "]." + bla[i] + "()");

}

        section.appendChild(title);
        section.appendChild(description);
        section.appendChild(button);
        section.appendChild(inputDiv);
        section.appendChild(outputDiv);
        section.appendChild(codeElement);

        container.appendChild(section);
        navContainer.appendChild(createNavButton(sectionId, item.title, index));
    });

    new KSageBlock(inputSelectors, outputSelectors, codeSelectors, codes, true);
}


function loadSections() {
    const container = document.getElementById("main-contentid");
    const navContainer = document.getElementById("nav-buttons-container");

    let inputSelectors = [];
    let outputSelectors = [];
    let codeSelectors = [];
    let codes = [];

    // מערך שמכיל שמות של פונקציות
    let bla = ["funcA", "funcB", "funcC", "funcD", "funcE", "funcF"];

    // פונקציות שמוגדרות
    function funcA() { return "a"; }
    function funcB() { return "b"; }
    function funcC() { return "c"; }
    function funcD() { return "d"; }
    function funcE() { return "e"; }
    function funcF() { return "f"; }

    values.forEach((item, index) => {
        let section = document.createElement("section");
        let sectionId = "section-" + (index + 1);
        section.id = sectionId;
        section.style.display = "none";

        let title = document.createElement("h2");
        title.textContent = item.title;

        let description = document.createElement("p");
        description.textContent = item.description;

        let button = document.createElement("button");
        button.textContent = "לקרוא עוד";
        button.onclick = function() {
            alert("אתה לוחץ על כפתור לקרוא עוד עבור: " + item.title);
        };



        // עדכון קטע הקוד לפי המערך bla עם הפונקציות        codeElement.id = codeId;
        for (let i = 0; i < 6; i++) {
            let inputDiv = document.createElement("div");
            let outputDiv = document.createElement("div");
            let codeElement = document.createElement("div");

            let inputId = "input-question-" + (index + 1)+"-"+ (i+1);
            let outputId = "output-question-" + (index + 1)+"-"+ (i+1);
            let codeId = "code-question-" + (index + 1)+"-"+ (i+1);


            inputId="input-question-" + (index + 1)+"-"+ (i+1);
            inputDiv.id = inputId;
            outputDiv.id = outputId;
            codeElement.id = codeId;


            inputSelectors.push("#" + inputId);
            outputId="output-question-" + (index + 1)+ "-"+ (i+1);
            outputSelectors.push("#" + outputId);

            codetId="code-question-" + (index + 1)+ "-"+ (i+1);
            codeSelectors.push("#" + codeId);
            codes.push("Q[" + index + "]." + bla[i] + "()");
            section.appendChild(inputDiv);
            section.appendChild(outputDiv);
            section.appendChild(codeElement);
        }

        section.appendChild(title);
        section.appendChild(description);
        section.appendChild(button);


        container.appendChild(section);
        navContainer.appendChild(createNavButton(sectionId, item.title, index));
    });

    new KSageBlock(inputSelectors, outputSelectors, codeSelectors, codes, true);
}

loadSections();
