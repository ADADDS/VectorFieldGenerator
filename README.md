![Readme Cover](https://user-images.githubusercontent.com/20411105/96369075-37f67a80-112e-11eb-9a9d-607ae58772f4.png)
# Vector Field Generator
Is a customizable vector field generator created with [Figma Plugin API](https://www.figma.com/plugin-docs/intro/) using [TypeScript](https://www.typescriptlang.org/). This plugins creates vector fields by allowing users to customize a small set of parameters that are used to generate a group of lines to visually simulate a [vector field](https://en.wikipedia.org/wiki/Vector_field).

## Instalation 
1. [Install on Figma](#)
2. Open a new or existing document, then either hit ```cmd+/``` or ```ctrl+;```, search "Vector Field Generator" and hit enter. Or search for the the plugin on Community tab.
3. Start messing around and once you are done, click  ```Generate``` to create your very first vector field.

## How it works
This plugin provides two core functionalities:

1. **Generate vector fields:** through trigonometry a n columns x n rows matrix is generated using small lines that simulate the behavior of mathematical vector fields.
2. **Smart populate:** you can randomize values for the number of rows, columns, padding, cell-size and color.


![Application Interface](https://user-images.githubusercontent.com/20411105/96369162-c9fe8300-112e-11eb-89b0-306267163e52.png)

 
* **Generate** creates the field using the values specified by the user.
* **Randomizer** will randomly create new values for the number of rows and columns, padding, cell-size and color. After that just click ```Generate```.
* **Reset default** makes all the values go back to their initial state.

**Note:** the randomizer function will only create square matrices - which means the number of columns equals the number of rows.

### Development
To setup the environment and start coding, do as follows:

1. Clone the repository:
```
$ git clone https://github.com/ADADDS/VectorFieldGenerator.git
```
2. Enter the plugin directory: 
```
$ cd VectorFieldGenerator
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

6. Select the VectorFieldGenerator/manifest.json file as the manifest

After these 6 steps, you can now test the plugin inside any of your Figma documents, acessing it in the ```Plugins -> Development``` menu. 

When adding new features and solving bug issues, you can compile the plugin by running again the line shown in Step 4. 

### Contributing
Pull requests are welcome. For major changes, please open an issue to discuss what you would like to change. Feel free to provide feedback and report bugs or unexpected behaviors. 

## Limitations
These are the known limititations to the version V1. 

* It's not currently possible to choose how many inflection points there will be on the matrix.
* It's not currently possible to place the inflection points whenever you please as their cartesian coordinates are generated randomly.
* It's not currently possible to control the width reduction parameters.
* It's not currently possible to control the rotation parameters.
* Due to performance issues, we are litiming the number of columns and rows to 50. 
* Keyboard navigation is not working properly.

<br>

Made with :heart: by [@tuiuiu](https://github.com/Tuiuiu) and [@lucianoinfanti](https://github.com/LucianoInfanti)
