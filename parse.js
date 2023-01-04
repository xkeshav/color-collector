const css_array = []; // master array to hold all values

const text = `:root {
}

body {
  background-color: #456698;
  color: #4523df;
}`;

const element = text.split('}');
console.log({element})
foreach ($element as $element) {
    // get the name of the CSS element
    $a_name = explode('{', $element);
    $name = $a_name[0];
    // get all the key:value pair styles
    $a_styles = explode(';', $element);
    // remove element name from first property element
    $a_styles[0] = str_replace($name . '{', '', $a_styles[0]);
    // loop through each style and split apart the key from the value
    $count = count($a_styles);
    for ($a=0;$a<$count;$a++) {
        if ($a_styles[$a] != '') {
            $a_key_value = explode(':', $a_styles[$a]);
            // build the master css array
            $css_array[$name][$a_key_value[0]] = $a_key_value[1];
        }
    }               
}