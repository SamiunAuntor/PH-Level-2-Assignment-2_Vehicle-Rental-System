import config from './config'
import app from './app';

const port = config.port;

app.listen(port, () => {
    console.log(`Vehicle Rental System Server is running on port ${port}`)
})
