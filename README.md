![Readme Cover](https://user-images.githubusercontent.com/20411105/95701000-c5ae0380-0c1e-11eb-9c9c-aff9138f849c.png)
# Vector Field Generator
Is a customizable vector field generator created with [Figma Plugin API](https://www.figma.com/plugin-docs/intro/) using [TypeScript](https://www.typescriptlang.org/). This plugins creates vector fields by allowing users to customize a small set of parameters that are used to generate a group of lines with the main porpourse of simulating vector fields.

## Instalation 
[Install on Figma](#)

1. Install the Figma Plugin.
2. In Figma, open a new or existing document, then either hit cmd+/ and search "Vector Field Generator" and hit enter or find the plugin on the Plugin tab.
3. Start messing around with the field's properties and once you are done, click  `Generate`.

## How it works
This plugin provides two core function:

1. **Generate vector fields:** through trigonometry a nxn matrix is generated with lines that simulate the behaviour of mathematical vector fields.
2. **Smart populate:** you can randomize values for the number of rows, columns, padding, cell-size and color.


![Application Interface](https://user-images.githubusercontent.com/20411105/95700967-ae6f1600-0c1e-11eb-9abc-88267e8ec4b9.png)

 
* **Generate** creates the vector field with the specified data.
* **Randomizer** will randomly create new values for the number of rows and columns, padding, cell-size and color.
* **Reset default** makes all the values go back to their initial state.

**Note:** the randomizer function will only create square matrix - which means the number of columns equals the number of rows.

## How to colaborate
You can colaborate by reporting bugs, sending feedback and feature requests. Here is how to do each one of them.
### Contributing
Pull requests are welcome. For major changes, please open an issue to discuss what you would like to change.


### Development
To setup the environment and start coding, do the following steps:

1. Clone the repository:
```
$ git clone https://github.com/ADADDS/PluginTest.git
```
2. Enter the plugin directory: 
```
$ cd PluginTest
```
3. Install dependencies: 
```
$ npm install
```
4. Build the plugin: 
```
$ npx webpack
```
5. Inside figma, go to ```Plugins -> Development -> New Plugin```

6. Select the PluginTest/manifest.json file as the manifest

After these 6 steps, you can now test the plugin inside any of your Figma documents, acessing it in the ```Plugins -> Development``` menu. 

When adding new features and solving bug issues, you can compile the plugin by running again the line shown in step 4. 

### Feedback
You can provide feedback and report bugs on this [Google Forms](#).

## Limitations
These are the known limititations to the version V1.

* It's not currently possible to choose how many inflection points there will be on the matrix.
* It's not currently possible to choose the inflection point's.
* It's not currently possible to control the width reduction parameters.
* It's not currently possible to control the rotation parameters.

## Known issues
At this moment there are no known issues.


Made with love by [@tuiuiu](https://github.com/Tuiuiu) and [@lucianoinfanti](https://github.com/LucianoInfanti)
