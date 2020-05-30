// import './dotenv-defaults';
const dotenv = require('dotenv-defaults');
import path from "path";

// Set the env file
const result2 = dotenv.config({
    path: path.join(process.cwd(), '.env'),
    encoding: 'utf8',
    defaults: path.join(process.cwd(), '.env.defaults')
});

if (result2.error) {
    throw result2.error;
}
