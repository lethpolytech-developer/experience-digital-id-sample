namespace CustomApi.Controllers
{
    // public class ExperienceJwtUser {
    //     public string Id { get; set; }
    //     public string ErpId { get; set; }
    //     public string[] Roles { get; set; }
    // }

    [ApiController]
    [Route("[controller]")]
    public class PhotoIdController : ControllerBase
    {
        private readonly ILogger<PhotoIdController> _logger;

        public PhotoIdController(ILogger<PhotoIdController> logger)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [EnableCors("CorsPolicy")]
        public IActionResult GetPhotoData()
        {
            try
            {
                // Validate JWT in middleware or here before processing request.
                // See here for more info: https://resources.elluciancloud.com/bundle/ellucian_experience/page/c_server_side_example_asp_net.html

                // Parse user from JWT
                var user = context.Items["user"] as ExperienceJwtUser;

                string filePath = @"\\your\photo\storage\file\path\" + user.ErpId + ".jpg";

                string photoData;

                if (System.IO.File.Exists(filePath))
                {
                    photoData = Convert.ToBase64String(System.IO.File.ReadAllBytes(filePath));
                }
                else
                {
                    photoData = Convert.ToBase64String(System.IO.File.ReadAllBytes("DefaultUserPhoto.png"));
                }

                return Ok(new { data = photoData });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { data = "" });
            }
        }

        [HttpGet]
        [EnableCors("CorsPolicy")]
        public IActionResult GetPhotoStatus()
        {
            string photoStatus = "Unverified";

            try
            {
                // Validate JWT in middleware or here before processing request.
                // See here for more info: https://resources.elluciancloud.com/bundle/ellucian_experience/page/c_server_side_example_asp_net.html

                // Parse user from JWT
                var user = context.Items["user"] as ExperienceJwtUser;

                string filePath = @"\\your\photo\storage\file\path\" + user.ErpId + ".jpg";

                string photoData;

                if (System.IO.File.Exists(filePath))
                {
                    photoStatus = "Verified";

                    if (System.IO.File.GetCreationTime(filePath) < DateTime.Now.AddDays(-365))
                    {
                        photoStatus = "Expired";
                    }
                }

                return Ok(new { status = photoStatus });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);

                return StatusCode(StatusCodes.Status500InternalServerError, new { status = photoStatus });
            }
        }
    }
}