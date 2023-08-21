### Sample Code
```
//判断是否是同一天
SqlFunc.DateIsSame(it.CreateTime,DateTime.Now)；

//判断是否是同一个月
it.CreateTime.ToString("yyyy-MM")==DateTime.Now.ToString("yyyy-MM")

//是否是同一年
it.CreateTime.Year==DateTime.Now.Year

//判断时间分片是否一致 
SqlFunc.DateIsSame(DateTime date1, DateTime date2, DateType dataType)；
var date1  = DateTime.Now;
var date2 = DateTime.Now;
var getByFuns = db.Queryable<Order>().Where(it => SqlFunc.DateIsSame( date1, date2, DateType.Day)).ToList();

//在当前时间加一定时间
SqlFunc.DateAdd(DateTime date, int addValue, DateType dataType)
//也可以用
it.CreateTime.AddDasy(1)
//聚合函数 Sum
var getByFuns2 = db.Queryable<Order>().GroupBy(it => it.Name)
                .Select(it => SqlFunc.AggregateSum(it.Price)).ToList();


//获取时间片
SqlFunc.DateValue(DateTime date, DateType dataType)
 
//也可以用
it.CreateTime.Day


SqlFunc.DateDiff(type,DateTime.Now,DateTime.Now.AddDays(1)) 
 //结果等于1 ，相差1天，小的时间在前面，大的时间在后面
 //生成的SQL
 DATEDIFF(day,@MethodConst1, (DATEADD(Day,@MethodConst4,@MethodConst3)) )
  
  
 //也可以
 (时间-时间).TotalDays


//聚合函数
SqlFunc.AggregateSum<TResult>(TResult thisValue) //求和
SqlFunc.AggregateSumNoNull<TResult>(TResult thisValue) //求和（新 支持过滤null）
SqlFunc.AggregateAvg<TResult>(TResult thisValue)//平均值
SqlFunc.AggregateMin(TResult thisValue) //最小
SqlFunc.AggregateMax<TResult>(TResult thisValue) //最大
SqlFunc.AggregateCount<TResult>(TResult thisValue)//统计数量
SqlFunc.AggregateDistinctCount<TResult>(TResult thisValue) //去重统计数量

//判断是不是空 不是NULL 

SqlFunc.HasValue(object thisValue)
SqlFunc.IsNullOrEmpty(object thisValue)
//可以取反
!SqlFunc.IsNullOrEmpty(object thisValue)

//范围判断
SqlFunc.Between(object value, object start, object end)
```

#### 查询
```
var newClass = db.Queryable<Order, OrderItem, Custom>((o, i, c) => new JoinQueryInfos(
    JoinType.Left, o.Id == i.OrderId,
    JoinType.Left, o.CustomId == c.Id
))
.Select((o, i, c) => new ViewOrder { Name = o.Name, CustomName = c.Name }).ToList();


var oneClass = db.Queryable<Order, OrderItem, Custom>((o, i, c) => new JoinQueryInfos(
    JoinType.Left, o.Id == i.OrderId,
    JoinType.Left, o.CustomId == c.Id
))
.Select((o, i, c) => c).ToList();

var twoClass = db.Queryable<Order, OrderItem, Custom>((o, i, c) => new JoinQueryInfos(
    JoinType.Left, o.Id == i.OrderId,
    JoinType.Left, o.CustomId == c.Id
))
.Select((o, i, c) => new { o, i }).ToList();
```


#### 更新
```
//列表更新
list[0].Price = 20;
list[1].Price = 2;
var result69 =
db.Updateable(list)
.PublicSetColumns(it => it.Price, "+")  
.ExecuteCommand();
```