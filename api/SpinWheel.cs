using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

    public static class SpinWheelFunction
    {
        [FunctionName("SpinWheel")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "prizewheel/spin")] HttpRequest req,
            ILogger log)
        {
            try
            {
                // Read the request body
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                // Use the values from the request body
                var wheelValues = data?.wheelValues;
                log.LogInformation($"Received wheel values: {JsonConvert.SerializeObject(wheelValues)}");

                // Ensure wheelValues is a valid array
                if (wheelValues != null && wheelValues is JArray && ((JArray)wheelValues).Children().Count() > 0)
                {
                    // Pick a random value from wheelValues
                    var random = new Random();
                    var jsonArray = (JArray)wheelValues;
                    var prizeIndex = random.Next(jsonArray.Children().Count());
                    var prizeValue = jsonArray[prizeIndex];

                    // Return the selected prize value
                    return new OkObjectResult(new { PrizeValue = prizeValue });
                }
                else
                {
                    // Handle empty or invalid wheelValues array
                    throw new Exception("Invalid or empty wheel values array.");
                }

            }
            catch (Exception ex)
            {
                // Log and return a 500 status code in case of an exception
                log.LogError($"Error in SpinWheelFunction: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return new StatusCodeResult(500);
            }
        }
    }

