3 EndPoints


  1) Get API:
      http://localhost:3000/shortlink/<alias>

  2) Post API:
      http://localhost:3000/shortlink
  
      sample json: 
        {
          "url": "http://google.com",
          "alias": "google"
        }
 
  3) Post API (Bulk Upload):
      http://localhost:3000/shortlink/upload
      
      sample file in project folder "csv_file_for_test"
