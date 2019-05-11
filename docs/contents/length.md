## Length and Shape

Data-Cube methods never change the __length__ of an array, i.e. the total number of entries:

```
x = [2, 3].rand(100);
```
```
x.$col(3, [200, 300]);  //does not add a new column
```

Native array methods that change the length of the array can be used as normal, but the shape, keys and labels of the array are discarded:

```
x.push(400, 500);
x;
```

The __shape__ of an array can be changed as long as the number of entries stays the same. Keys and labels are discarded when the shape is changed:

```
x.$shape([2, 4]).$label(0, 'rows');
```
```
x.$shape(1);
```

---

__Notes:__ 

* _The `length` property of a cube should not be changed directly, nor by setting a nonexistent entry using square brackets._ Use [toArray](#) to convert a cube to an array before changing its length directly, and use [$ent](#) or [$at](#) to catch length changes when setting individual entries. (Unfortunately, making `length` non-writable for cubes is prohibitively expensive.)

* Native array methods such as `push` and `splice` that mutate the calling array are modified so that a cube is converted back to a standard array before the method is applied. 

```{.no-input .no-output}
deleteVariables('x');
```