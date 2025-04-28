const dataGenerator = require('./services/data-generator');
const dataProcessor = require('./services/data-processor')


dataGenerator.connect();
dataProcessor.startConsumer();