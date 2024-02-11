using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace PrizeWheelApi
{
    public static class SpinWheelFunction
    {
        // Azure Function triggered by an HTTP POST request at the specified route
        [FunctionName("SpinWheel")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "prizewheel/spin")] HttpRequest req,
            ILogger log)
        {
            try
            {
                // Convert current UTC time to US Eastern Time
                var easternTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
                var currentTimeInEastern = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, easternTimeZone);

                // Check if the current minute is divisible by 3
                if (currentTimeInEastern.Minute % 3 == 0)
                {
                    // Throw an exception if spinning the wheel is not allowed at this minute
                    throw new Exception("Did not expect the wheel to be spun at this minute.");
                }

                // Read the request body 
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

        // Deserialize request body to dynamic object
        dynamic data = JsonConvert.DeserializeObject(requestBody);

        // Get wheelValues array from request
        var wheelValues = data?.wheelValues;

                // Log the received values
                log.LogInformation($"Received wheel values: {JsonConvert.SerializeObject(wheelValues)}");

                // Validate the input
                if (wheelValues != null && wheelValues is JArray && wheelValues.Count > 0)
                {
                    // Get a random index for the prize
                    var random = new Random();
                    var prizeIndex = random.Next(wheelValues.Count);

          // Get prize value
          var prizeValue = jsonArray[prizeIndex];

          // Log selected prize
          log.LogInformation($"Selected prize value: {prizeValue}");

                    // Return the selected prize value as a response
                    return new OkObjectResult(prizeValue);
                }
                else
                {
                    // Throw an error if the input is invalid or the wheel values array is empty
                    throw new Exception("Invalid or empty wheel values array.");
                }
            }
            catch (Exception ex)
            {
                // Log any errors and return a 500 status code
                log.LogError($"Error in SpinWheelFunction: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return new StatusCodeResult(500);
            }
        }
    }
}
