<h1> Vector Field Generator</h1>
Is a customizable vector field generator created with <a href="https://www.figma.com/plugin-docs/intro/">Figma Plugin API</a> using <a href="https://www.typescriptlang.org/">TypeScript</a>.
 
<h2> How it works</h2>
<ol>
<li>Install the Figma Plugin.</li>
<li>In Figma, open a new or existing document, then either hit cmd+/ and search "Vector Field Generator" and hit enter or find the plugin on the Plugin tab.</li>
<li>Start messing around with the field's properties and once you are done, click  ```Generate```.</li>
</ol>

[app picture]

<ul> 
<li><b>Generate</b> creates the vector field with the specified data.</li>
<li><b>Randomizer</b> will randomly create new values for the number of rows and columns, padding, cell-size and color.</li>
<li><b>Reset default</b> makes all the values go back to their initial state.</li>
</ul>

<h2>How to colaborate</h2>

<h3>Feedback</h3>
You can provide feedback and report bugs on this <a hre="#">Google Forms</a>.
<h3></h3>

<h2>Limitations</h2>
These are the known limititations to the version V1.
<ul> 
<li>It's not currently possible to choose how many inflection points there will be on the matrix.</li>
<li>It's not currently possible to choose the inflection point's.</li>
</ul>

<h2>Known issues</h2>



Made with <3 by @lucas and @lucianoinfanti




Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/setup/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "tsc: watch - tsconfig.json". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
