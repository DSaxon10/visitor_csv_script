# About this script
The provided script will populate visitors to your experiment and store each visitor's id, experiment id and variation id within a csv file. You are able to adjust your desired visitor amount and path you would like the csv to save

## Use Case
In order to demo the Optimizely Data and Attribution for Salesforce app (DNA) within your own an account, you need to ensure the leads you uploaded into Salesforce carry experiment and variation values that are tied to experiments within your account. This script allows you to those generate visitors into an an experiment and store the needed values into a csv. 

# How to use

### Pre-Requisite 

#### Create an Experiment
1. Create A/B Experiment within your Optimizely Project
2. Limit to 2 Variations
3. Ensure Orignal variation name remains "Original"
4. Add Metrics
5. Leave Audience as "Everyone"
6. Run Experiment
7. Within the experiment's `API Names` gather:
  - experiment_id
  - account_id
  
#### Generate a Personal Access Token
If you do not have one already readily available you will need to generate a new token in order for the script to access the experiment Layer info through the REST API. To generate a new token follow the instructions [within this knowledge base article](https://help.optimizely.com/Integrate_Other_Platforms/Generate_a_personal_access_token_in_Optimizely_X_Web)
  
### Running the Script
1. `git clone` this repo
2. run `npm install`
3. Update below values witin `Visitor_Generator_and_CSV.js` to align with the experiment that you created above:
  - Experiment ID
  - Account ID
  - PERSONAL_ACCESS_TOKEN
  _ csv_path to save csv file
4. Save Changes
5. run `node app.js` in the terminal

## Using the extension
* Create a new analytics integration from JSON, using the contents of `extension.json`:
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/using_json.png)
* Update the API key to a personal full stack project in the integration settings
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/sdkKey.png)
* Create a new test targeting `http://localhost:3000`
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/url_targeting.png)
* Create events in your full stack project that match the names of your web Events
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/clicked_checkout_web.png)
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/clicked_checkout_fullstack.png)
* Run the test. There is log output in the javascript console to confirm the integration is working
![Screenshot](https://raw.githubusercontent.com/rockymcgredy-optimizely/fullstack_events_integration/master/public/images/console_log.png)
