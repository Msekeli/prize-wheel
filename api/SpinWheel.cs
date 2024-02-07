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
                    throw new Exception("Did not expect the wheel to be spun at this minute.");
                }

                // Read request body 
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

                // Deserialize request body to dynamic object
                dynamic data = JsonConvert.DeserializeObject(requestBody);

                // Get wheelValues array from request
                var wheelValues = data?.wheelValues;

                // Log received values
                log.LogInformation($"Received wheel values: {JsonConvert.SerializeObject(wheelValues)}");

                // Validate input
                if (wheelValues != null && wheelValues is JArray && wheelValues.Count > 0)
                {
                    // Get random index for prize
                    var random = new Random();
                    var prizeIndex = random.Next(wheelValues.Count);

                    // Get prize value
                    var prizeValue = wheelValues[prizeIndex];
                    // Log selected prize
                    log.LogInformation($"Selected prize value: {prizeValue}");

                    // Return result
                    return new OkObjectResult(prizeValue);
                }
                else
                {
                    // Throw error if invalid input
                    throw new Exception("Invalid or empty wheel values array.");
                }
            }
            catch (Exception ex)
            {
                // Log any errors
                log.LogError($"Error in SpinWheelFunction: {ex.Message}\nStackTrace: {ex.StackTrace}");
                return new StatusCodeResult(500);
            }
        }
    }
}
