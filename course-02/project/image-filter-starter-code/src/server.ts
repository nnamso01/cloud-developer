import express, {Request, Response} from 'express';
import isUrl from 'is-url';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get("/filteredimage", async (req: Request, res: Response) => {
    let {image_url} = req.query
    if (!image_url || !isUrl(image_url)) {
      res.status(400).send({message: "invalid image url"})
    }
    
    try {
      const filteredFile: string = await filterImageFromURL(image_url)
      res.status(200).sendFile(filteredFile)
    } catch (error) {
      console.log(error)
      res.status(500).send({message: "unable to filter image"})
    }

  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();