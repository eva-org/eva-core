module.exports = {
    name: 'ReturnValueTestPlugin',
    quick: 'return',
    exec: () => {
      return ['one', 'two', 'three']
    }
}
