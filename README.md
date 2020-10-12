![Readme Cover](https://user-images.githubusercontent.com/20411105/95701000-c5ae0380-0c1e-11eb-9c9c-aff9138f849c.png)
<h1> Vector Field Generator</h1>
Is a customizable vector field generator created with <a href="https://www.figma.com/plugin-docs/intro/">Figma Plugin API</a> using <a href="https://www.typescriptlang.org/">TypeScript</a>. This plugins creates vector fields by allowing users to customize a small set of parameters that are used to generate a group of lines with the main porpourse of simulating vector fields.

<h2> Instalation</h2>
<a href="#">Install on Figma</a>
<ol>
 <li>Install the Figma Plugin.</li>
 <li>In Figma, open a new or existing document, then either hit cmd+/ and search "Vector Field Generator" and hit enter or find the plugin on the Plugin tab.</li>
 <li>Start messing around with the field's properties and once you are done, click  `Generate`.</li>
</ol>

<h2> How it works</h2>
This plugin provides two core function:
<ol>
 <li><b>Generate vector fields:</b>trhought trigonometry a nxn matrix is generated with lines that simulate the behaviour of mathematical vector fields.</li>
 <li><b>Smart populate:</b> you can randomize values for the number of rows, columns, padding, cell-size and color.</li>
</ol>

![Application Interface](https://user-images.githubusercontent.com/20411105/95700967-ae6f1600-0c1e-11eb-9abc-88267e8ec4b9.png)

<ul> 
<li><b>Generate</b> creates the vector field with the specified data.</li>
<li><b>Randomizer</b> will randomly create new values for the number of rows and columns, padding, cell-size and color.</li>
<li><b>Reset default</b> makes all the values go back to their initial state.</li>
</ul>
<b>Note:</b> the randomizer function will only create square matrix - which means the number of columns equals the number of rows.

<h2>How to colaborate</h2>
You can colaborate by reporting bugs, sending feedback and feature requests. Here is how to do each one of them.
<h3>Contributing</h3>
Pull requests are welcome. For major changes, please open an issue to discuss what you would like to change.
To open an issue do as follows:
<ul>
 <li>Clone the repository: git clone https://github.com/brianlovin/figma-dominant-color-toolkit.git</li>
  <li>Go to the directory: cd figma-dominant-color-toolkit</li>
  <li> Install dependencies with npm install</li>
  <li>Build the plugin: npm run devGo to the plugins directory in Figma</li>
   <li>Add a new development plugin</li>
   <li>ASelect the figma-dominant-color-toolkit/manifest.json file as the manifest</li>
</ul>

<h3>Feedback</h3>
You can provide feedback and report bugs on this <a hre="#">Google Forms</a>.

<h2>Limitations</h2>
These are the known limititations to the version V1.
<ul> 
 <li>It's not currently possible to choose how many inflection points there will be on the matrix.</li>
 <li>It's not currently possible to choose the inflection point's.</li>
 <li>It's not currently possible to control the width reduction parameters.</li>
 <li>It's not currently possible to control the rotation parameters.</li>
</ul>

<h2>Known issues</h2>
At this moment there are no known issues.


Made with love by @lucas and @lucianoinfanti
