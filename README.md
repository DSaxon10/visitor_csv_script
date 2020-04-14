# About this script
The provided script will populate visitors to your experiment and store each visitor's id, experiment id and variation id within a csv file. You are able to adjust your desired visitor amount and path where you would like the csv saved.

The default amount of visitors is set to 3000. (You can adjust value within the `state` object of the `Visitor_Generator_and_CSV.js` script. Read more in the Bonus section)

## Use Case
In order to demo the Optimizely Data and Attribution for Salesforce app (DNA) within your own an account, you need to ensure the leads you upload into Salesforce carry experiment and variation values that are tied to experiments within your account. This script allows you to generate those visitors into your experiment and store the needed values into a csv. 

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
  
![API Name](https://i.imgur.com/7IriC1e.png)
  
#### Generate a Personal Access Token
If you do not have one already readily available you will need to generate a new token in order for the script to access the experiment Layer info through the REST API. To generate a new token follow the instructions [within this knowledge base article](https://help.optimizely.com/Integrate_Other_Platforms/Generate_a_personal_access_token_in_Optimizely_X_Web)
  
### Running the Script
1. `git clone` this repo
2. run `npm install`
3. Update below values witin `Visitor_Generator_and_CSV.js` to align with the experiment that you created above:
  - Experiment ID
  - Account ID
  - PERSONAL_ACCESS_TOKEN
  - csv_path to save csv file
 
 ![Script Update](https://i.imgur.com/unuY4LX.png)

4. Save Changes
5. run `node Visitor_Generator_and_CSV.js` in the terminal

##### Bonus

If you would like to adjust the amount of visitors that are populating your experiment you can adjust from the `visitors` default value of 3000 in the `state`object in `Visitor_Generator_and_CSV.js`.

![Visitor Count](https://i.imgur.com/fPuQffX.png)

## This does NOT currently support:

1. Personalization Campaigns
2. Feature Tests
3. MVT Experiments
4. A/B/n Experiments
5. Experiments with Audiences

Currently on my tbd along with a UI.

Thanks and reach out to me with comments and/or questions!

devin@optimizely.com
@devin
