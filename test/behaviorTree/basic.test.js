import behaviorTreeBuilder from '../../assets/Script/AI design/SM&BT/behaviorTree/behaviorTree';

// const test = (resolve, reject) => {
//   console.log('test');
//   if (true) {
//     resolve();
//   } else {
//     reject();
//   }
// };

// const bt = behaviorTreeBuilder()
//   .activeSelector()
//   .sequence()
//   .action()
//   .end()
//   .action()
//   .sequence()
//   .action()
//   .end()
//   .action()
//   .end();

const bt = behaviorTreeBuilder()
  .activeSelector()
  .sequence()
  .action()
  .end()
  .action()
  .sequence()
  .action()
  .end()
  .action()
  .finish();

console.log(Object.keys(bt));

