# csharp-mixin-generator

Generate mixin for C# using partial class template

## Install
```
npm install -g csharp-mixin-generator
```

## Usage
```
    csharp-mixin-generator -h

    Usage:
        csharp-mixin-generator -c CLASSNAME [-n NAMESPACE] [-p]
        csharp-mixin-generator -h | --help | --version

    Generate mixin based on text template.
    Just pass in the target classname to the -c argument.

    Options:
        -c CLASSNAME      The classname.
        -n NAMESPACE      The namespace if any.
        -p                If the class is public. [default: true].
        -h --help         Show this screen.
        --version         Show version.
```

## Examples
```
    cat template.cs.mixin | csharp-mixin-generator -c MyClassName -n MyNameSpace
```

## License
MIT © [Ha.Minh](https://github.com/minhhh)
