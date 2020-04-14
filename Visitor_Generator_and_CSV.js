const request = require('request');
const fetch = require('node-fetch');
const moment = require('moment');
const guid = require('uuid');
const React = require ('react');
const _ = require('underscore');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Immutable = require('immutable');

/*
Results Page Script w/ CSV download of Visitor ID, Experiment ID, and
Variation ID and Name.

For first iteration of this script you will need to have:

      1. Have created an Experiment within optimizely
      2. Limit the experiment to two variations (original and variation_one)
        Ensure to leave the original variation name as `original`
      3. Include one metric along with a revenue metric
      4. Create Personal Access Token with Optimizely account
      5. Enter experiment Id, Event Type, Account ID,
      csv_path (ex:/users/dsaxon/desktop/file5.csv') and Personal Access Token.
      6. Run within your node environment and you will get your csv file on your
      desktop


If you want to change the visitor amount on
      */

const PERSONAL_ACCESS_TOKEN = 'your_token';
const LOG_API_URL = 'https://logx.optimizely.com/v1/events';
const experiment_id = 'your_experiment_id';
const account_id = 'your_account_id';
const event_api_name = 'add_to_cart';
const event_type = 'Custom';
const csv_path = '/your/path'
let json;
let body;



// Options needed for REST API to gather Experiment Layer Data for script.

const options = {
    url: 'https://api.optimizely.com/v2/experiments/'+experiment_id,
    method: 'GET',
    headers: {
        'Authorization': PERSONAL_ACCESS_TOKEN,
    }
};



let campaign_id;
let project_id;
let event_id;
let page_id;
let original_name;
let orig_var_id;
let variation_name;
let variation_id;
let earliest;

//REST API Call and
request(options, function(err, res, body) {

  json = JSON.parse(body);
  campaign_id = json.campaign_id;
  project_id = json.project_id;
  event_id = json.metrics[0].event_id;
  page_id = json.variations[0].actions[0].page_id;
  original_name = 'original';
  orig_var_id = json.variations[0].variation_id;
  variation_name = json.variations[1].variation_id;
  variation_id = json.variations[1].variation_id;
  earliest = json.earliest;

  state = {
      expectedRevenue: 60000,
      expectedValue: 1000000.0,
      generateDisable: true,
      timespan:
        moment.now().valueOf() -
        moment(earliest).valueOf(),
      visitors: 1000,
  };

  _generateDecision = (isHoldback, experimentId, variation) => ({
        campaign_id: campaign_id,
        experiment_id: experiment_id,
        variation_id: variation,
        is_campaign_holdback: isHoldback,
      });


  _generateEventMap = metricEvents => {
      let eventMap = Immutable.Map();
      metricEvent => {
      const event = {
        id: event_id,
        key: event_api_name,
        event_type: event_type,
      };
      event.conversion_rate = (Math.random() * 40 + 30) / 100.0;
      eventMap = eventMap.event_id, toImmutable(event);
    };
    return eventMap;
  };

  _generateEvents = ({
    averageEventValue,
    averageRevenueValue,
    timestamp,
    isHoldback,
    eventMap,
    currentVariation,
  }) => {
    const events = [
      {
        entity_id: campaign_id,
        uuid: String(guid()),
        key: 'campaign_activated',
        timestamp,
      },
    ];
    event => {
      const conversionChance = Math.random();
      let expectedConversionRate = event.get('conversion_rate');
      expectedConversionRate += currentVariation.get('conversion_lift');
      if (conversionChance <= expectedConversionRate) {
        events.push({
          entity_id: event_id,
          key: event_api_name,
          timestamp,
          revenue: averageRevenueValue,
          uuid: String(guid()),
        });
      }
    };
    return events;
  };

let visitor_csv = [];

  generateFakeData = () => {


    const BATCH_EVENTS_TEMPLATE = {
      account_id: account_id,
      project_id: project_id,
      visitors: [],
      anonymize_ip: true,
      client_name: 'dsax/daboss.dawg',
      client_version: '1.0.0',
    };

  let data = _.clone(BATCH_EVENTS_TEMPLATE);


    metricEvents = {
      event_id: event_id,
      event_type: event_type,
    }

  /*  const metricEvents = Immutable.Set(
      layer.get('metrics').map(metric =>
        toImmutable({
          event_id: metric.get('event_id'),
          event_type: metric.get('event_type'),
        }),
      ),
    ).filter(event => event.get('event_id'));
  */
    const eventMap = _generateEventMap(metricEvents);

    const averageRevenueValue = parseInt(
      (state.expectedRevenue / state.visitors) * 100,
      10,
    );

    const averageEventValue = state.expectedValue / state.visitors;

    let early = moment().valueOf();

    if (earliest) {
      if (moment(earliest).valueOf() < early) {
        earliest = moment(earliest).valueOf();
      }
    }

    let currentExperimentId;
    let currentVariation;
    let currentVariationId;
    let features;
    let isHoldback;
    let timestamp;
    let visitorEvent;
    for (let i = 0; i < state.visitors; i++) {
      if (i > 0 && i % 100 === 0) {
        console.log(`Generated ${i} out of ${state.visitors} visitors`);
      }

      currentExperimentId = experiment_id;
      currentVariation = Math.random() < 0.5 ? original_name : variation_name;


      if (currentVariation == original_name) {
        currentVariationId = orig_var_id;
      }
      else {
        currentVariationId = variation_id;
      }


      timestamp = parseInt(
        Math.max(
          earliest + (state.timespan / state.visitors) * i,
          earliest,
        ),
        10,
      );

      features = _generateFeatures();

      visitorEvent = {
        attributes: features,
        session_id: `session_${timestamp}`,
        snapshots: [
          {
            decisions: [
              _generateDecision(
                isHoldback,
                currentExperimentId,
                currentVariationId,
              ),
            ],
            events: _generateEvents({
              averageEventValue,
              averageRevenueValue,
              currentVariation,
              eventMap,
              isHoldback,
              timestamp,
            }),
          },
        ],
        visitor_id: `visitor_${timestamp}`,
      };
      data.visitors.push(visitorEvent);

      visitor_csv.push({
        Visitor_Id: visitorEvent.visitor_id,
        Experiment_Id: currentExperimentId,
        Variation_Id: currentVariationId
      });


      if (i && i % 1000 === 0) {
        _postBatch(data);
        data = _.clone(BATCH_EVENTS_TEMPLATE);
      }

      if (i == state.visitors - 1) {
        const csvWriter = createCsvWriter({
            path: csv_path,
            header: [
                {id: 'Visitor_Id', title: 'visitor_id'},
                {id: 'Experiment_Id', title: 'experiment_id'},
                {id: 'Variation_Id', title: 'variation_id'},
            ]
        });

        csvWriter.writeRecords(visitor_csv)
            .then(() => {
          console.log('...Done');
        });

      }

    }

    _postBatch(data);
  };



  _generateFeatures = () => [
    {
      entity_id: 100,
      type: 'browserId',
      value: _selectRandomFromArray(['ff', 'gc', 'ie', 'safari']),
    },
    {
      entity_id: 200,
      type: 'campaign',
      value: _selectRandomFromArray([
        'winter campaign',
        'discount',
        'frequent visitors',
      ]),
    },
    {
      entity_id: 300,
      type: 'device',
      value: _selectRandomFromArray([
        'desktop',
        'ipad',
        'iphone',
        'mobile',
        'tablet',
      ]),
    },
    {
      entity_id: 600,
      type: 'source_type',
      value: _selectRandomFromArray([
        'campaign',
        'direct',
        'referral',
        'search',
      ]),
    },
  ];

  _selectRandomFromArray = items => {
    if (Immutable.List.isList(items)) {
      return items.get(Math.floor(Math.random() * items.size));
    }
    return items[Math.floor(Math.random() * items.length)];
  };

  _postBatch = data => {
    fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

generateFakeData();

  })
