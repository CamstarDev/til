# Today I Learned

## 2023-07-14

### 
```
using System;
namespace Wrox{
    public class Program{
        static int j = 0;
        private int j = 10;
        public static void Main(string[] args){

            int j = 20;
            Console.WriteLine(j); // 20
            Console.WriteLine(Program.j); // 0
            Console.WriteLine(this.j); //10
        }
    }
}
```