# Custom Unit - Colored Custom Field

The mashup adds a new custom unit to the Customize Cards tab in a View Setup area, based on a custom field that needs to be specified in the mashup code. The values of that custom field are mapped to colors in the mashup code, which will the be used to color the values on the cards.

In the mashup code, define your custom field in the name section `name` (e.g. "Risk"). The values of the custom field and corresponding colors are listed in the section `colors`. Each value must be created as pair of the value name (e.g. `"High Risk"`) and the color.

Colors are entered in multiple formats:
- color name in plain text: `"red"`, `"pink"` etc.; list of supported colors may vary from browser to browser; you can find list of widely recognized colors e.g. [here](http://html-color-codes.info/color-names/)
- hex code, e.g. `#FF0000` for red, `#00FF00` for green
- RGB value, e.g. `"rgb(255, 0, 0)"` for red, `"rgb(255, 255, 0)"` for yellow
- two separate colors for text and background to make text more contrast and readable, e.g. `{text: "black", background: "rgb(255, 255, 0)"}`

Example:

```
{
    "name": "Risk",
    "colors": {
        "High Risk": "red",
        "Low Risk": "#00FF00",
        "Medium Risk": {text: "black", background: "rgb(255, 255, 0)"}
    }
}
```

##### Colored Custom Field on List
![Colored Custom Field on List](./colored-cf-list.png)

##### Colored Custom Field on Board
![Colored Custom Field on Board](./traffic-light.png)
