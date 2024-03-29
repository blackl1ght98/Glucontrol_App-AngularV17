﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DiabetesNoteBook.Application.DTOs;
using DiabetesNoteBook.Application.Interfaces;
using DiabetesNoteBook.Domain.Models;
using DiabetesNoteBook.Application.Services;
using System.Text;
using Newtonsoft.Json;
using DiabetesNoteBook.Application.Classes;
using System.Security.Claims;
using DiabetesNoteBook.Infrastructure.Interfaces;
using DiabetesNoteBook.Infrastructure.Repositories.UpdateOperations;
using DiabetesNoteBook.Application.Services.Genereics;
using Aspose.Pdf.Operators;

namespace DiabetesNoteBook.Infrastructure.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    //NOTA: TODAS LAS OPERACIONES QUE SEAN POST,PUT Y DELETE EL GUARDAR ACTUALIZAR O ELIMINAR ESTAS 
    //FUNCIONES SE ENCARGAN LOS SERVICIOS ASIGNADOS. POR EJEMPLO: await _newRegisterService.NewRegister(new DTORegister
    //TENEMOS ESETE SERVICIO DE REGISTRO ESTE SERVICIO ES EL QUE SE ENCARGA DE GUARDAR LOS CAMBIOS
    //POR LO TANTO NO ES NECESARIO HACER EL GUARDADO EN EL ENDPOINT YA QUE SE ENCARGA EL SERVICIO DE HACERLO.
    //Se llaman a los servicios necesarios para este controlador, los servicios no se ponen directamente
    //para promover la reutilizacion de dichos servicios, hay servicios que no al no recibir muchisimos
    //cambios se pone directamente el servicio.
    public class UsersController : ControllerBase
    {
        private readonly DiabetesNoteBookContext _context;
        private readonly HashService _hashService;
        private readonly TokenService _tokenService;
        private readonly INewRegister _newRegisterService;
        private readonly IEmailService _emailService;
        private readonly IConfirmEmailService _confirmEmailService;
        private readonly IBajaUsuarioServicio _userDeregistrationService;
        private readonly IDeleteUserService _deleteUserService;
        private readonly IChangeUserDataService _changeUserDataService;
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _config;


        private readonly IUsuarioRepositoryEmailAndUsername _usuarioRepositoryEmailAndUsername;
		private readonly IActualizacionYEnvioDeCorreoElectronico _actualizacionYEnvioDeCorreoElectronico;
        private readonly ExistUsersService _existUsersService;


        //Se realiza el contructor

        public UsersController(DiabetesNoteBookContext context, TokenService tokenService, HashService hashService,
            INewRegister newRegisterService, ILogger<UsersController> logger,
            IEmailService emailService, IConfirmEmailService confirmEmailService, IBajaUsuarioServicio userDeregistrationService,
            IDeleteUserService deleteUserService, IChangeUserDataService changeUserDataService, 
			 IUsuarioRepositoryEmailAndUsername emailAndUsername, IConfiguration configuration,
            IActualizacionYEnvioDeCorreoElectronico actualizacionYEnvioDeCorreoElectronico, ExistUsersService existUsersService)
        {
            _context = context;
            _hashService = hashService;
            _tokenService = tokenService;
           _existUsersService= existUsersService;
            _emailService = emailService;
            _confirmEmailService = confirmEmailService;
            _newRegisterService = newRegisterService;
            _userDeregistrationService = userDeregistrationService;
            _deleteUserService = deleteUserService;
            _changeUserDataService = changeUserDataService;
           _logger = logger;
          _config = configuration;
           
			_usuarioRepositoryEmailAndUsername= emailAndUsername;
			_actualizacionYEnvioDeCorreoElectronico = actualizacionYEnvioDeCorreoElectronico;
			
			

		}
        //Este endpoint su funcion es de que el usuario se pueda regristrar en la aplicacion
        //este endpoint tiene un DTO llamado DTORegister que contiene los datos necesarios para
        //que el usuario se pueda registrar dichos datos vienen del body. Para el acceso al DTO
        //le hemos llamado userData para poder acceder a estos datos
        [AllowAnonymous]
        [HttpPost("registro")]
        public async Task<ActionResult> UserRegistration([FromBody] DTORegister userData)
        {

            try
            {
                var usuarioDBUser = await _existUsersService.UserNameExist(userData.UserName);

                //var usuarioDBUser = _getRegisterUsername.ObtenerPorNombreUsuario(userData.UserName);
                //Buscamos en la base de datos si el nombre de usuario que se intenta registrar existe en base de datos
                //var usuarioDBUser = _context.Usuarios.FirstOrDefault(x => x.UserName == userData.UserName);
                //Si dicho nombre de usuario existe, al usuario le sale el mensaje contenido en el BadRequest.
                if (usuarioDBUser is true)
                {
                    return BadRequest("Usuario existente");
                }
                //if (usuarioDBUser != null)
                //{
                //    return BadRequest("Usuario existente");
                //}
                var usuarioDBEmail = await _existUsersService.EmailExist(userData.Email);
                if (usuarioDBEmail is true)
                {
                    return BadRequest("El email ya se encuentra registrado");
                }
                //var usuarioDBEmail= _getRegisterEmail.ObtenerPorEmail(userData.Email);
                //Buscamos en base de datos el email del usuario por si un usuario se intenta registrar con
                //un email que ya se ha registrado en base de datos
                //var usuarioDBEmail = _context.Usuarios.FirstOrDefault(x => x.Email == userData.Email);
                //Si el usuario pone un email que se encuentra en la base de datos le sale el mensaje
                //contenido en el BadRequest.
                //if (usuarioDBEmail != null)
                //{
                //    return BadRequest("El email ya se encuentra registrado");
                //}
                //llegados a este punto el nombre de usuario y email no existe y por lo tanto se procede
                //al registro llamando al servicio _newRegisterService, este servicio tiene un metodo el cual
                //se encarga de registrar al usuario dicho servicio precisa de los datos del usuario que se 
                //encuentra en DTORegister debido que asi es como lo marca el metodo NewRegister del servicio
                //de _newRegisterService
                await _newRegisterService.NewRegister(new DTORegister
                {
                    Avatar = userData.Avatar,
                    UserName = userData.UserName,
                    Email = userData.Email,
                    Password = userData.Password,
                    Nombre = userData.Nombre,
                    PrimerApellido = userData.PrimerApellido,
                    SegundoApellido = userData.SegundoApellido,
                    Sexo = userData.Sexo,
                    Edad = userData.Edad,
                    Peso = userData.Peso,
                    Altura = userData.Altura,
                    Actividad = userData.Actividad,
                    Medicacion = userData.Medicacion,
                    TipoDiabetes = userData.TipoDiabetes,
                    Insulina = userData.Insulina
                });
                //cuando el usuario se registra hay un servicio que manda un email para que confirme la
                //creacion de la cuenta si el usuario no confirma su cuenta no puede hacer login hasta que
                //no confirme su email esto se hace para evitar accesos no deseados.
                //Este servicio de enviar el email tiene un metodo SendEmailAsyncRegister que precisa de un
                //DTOEmail que contiene el email.
                await _emailService.SendEmailAsyncRegister(new DTOEmail
                {
                    ToEmail = userData.Email
                });
				
				

                return Ok();
            }
            catch(Exception ex) 
            {
                _logger.LogError(ex, "Error al procesar el registro");
                return BadRequest("En estos momentos no se ha podido realizar le registro, por favor, intentelo más tarde.");
            }
        }
        //Como hemos comentado en el controlador anterior si el usuario no confirma su email este
        //no podra loguearse este endpoint se encarga de hacer esta funcion de ver si se ha
        //confirmado o no, si el token que tiene el usuario es valido...
        //Este endpoint tiene un DTOConfirmRegistrtion que contiene los datos necesarios para dicha
        //comprobacion
        //----------------------------------CODIGO ANTIGUO FUNCIONA 100%--------------------------------------------------------
   //     [AllowAnonymous]
   //     [HttpGet("validarRegistro/{UserId}/{Token}")]
       
   //     public async Task<ActionResult> ConfirmRegistration([FromRoute] DTOConfirmRegistrtion confirmacion)
   //     {
   //         //	//Ponemos una variable de tipo string que esta va ha ser un boton que va a reedirigir a
   //         //	//http://localhost:4200 esto llevara al usuario al front que tenemos en angular concretamente
   //         //	//al login para que se loguee el usuario.
   //         string mensaje = "<a class='btn btn-primary' href='http://localhost:4200'>Ir a login</a>";
			//try
			//{
			//	//Buscamos al usuario en base a su id para controlar si el usuario se ha validado o no.
			//	var usuarioDB = _context.Usuarios.FirstOrDefault(x => x.Id == confirmacion.UserId);
			//	//Si el usuario vuelve a confirmar su email le saldra el mensaje contenido en la variable
			//	//mensaje.
			//	if (usuarioDB.ConfirmacionEmail != false)
			//	{
			//		mensaje = "<p class='display-5 mb4'> Usuario ya validado con anterioridad.</p>";
			//	}
			//	//Si el token ha sido alterado o ha caducado le saldra el mensaje contenido en la variable
			//	//mensaje.
			//	if (usuarioDB.EnlaceCambioPass != confirmacion.Token)
			//	{
			//		mensaje = "<p class='display-5 mb4'>Token no valido</p>";
			//	}

   //     await _confirmEmailService.ConfirmEmail(new DTOConfirmRegistrtion
   //         {
   //         UserId = confirmacion.UserId
   //         });
   //             StringBuilder responseHtml = new StringBuilder();
   //             string bootstrap = "<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3' crossorigin='anonymous'>";
   //             responseHtml.AppendLine(bootstrap);
   //             responseHtml.AppendLine("<div class='px-4 py-5 my-5 text-center'>");
   //             responseHtml.AppendLine("<div class='col-lg-6 mx-auto'>");
   //             responseHtml.AppendLine(mensaje);
   //             //responseHtml.AppendLine("<p class='display-5 mb-4'>Enlace incorrecto o ya utilizado</p>");
   //             responseHtml.AppendLine("<div class='d-grid gap-2 d-sm-flex justify-content-sm-center'>");
   //             responseHtml.AppendLine("</div></div></div>");
   //             //Para que se muestre correctamente este mini front lo tenemos que devolver de esta manera.
   //             return Content(responseHtml.ToString(), "text/html", Encoding.UTF8);
   //         }
   //         catch
   //         {

   //             return BadRequest("En estos momentos no se ha podido validar el registro, por favor, intentelo de nuevo más tarde.");
   //         }
   //     }



        //------------------------------------------------------------------------------------------------
        //---------------------------------------CODIGO NUEVO---------------------------------------------------------
        [AllowAnonymous]
        [HttpGet("validarRegistro/{UserId}/{Token}")]
        public async Task<ActionResult> ConfirmRegistration([FromRoute] DTOConfirmRegistrtion confirmacion)
        {

            try
            {
                var usuarioDB = await _existUsersService.UserExistById(confirmacion.UserId);

                //var usuarioDB = _usuarioPorId.ObtenerUsuarioPorId(confirmacion.UserId);
                //var usuarioDB = _context.Usuarios.FirstOrDefault(x => x.Id == confirmacion.UserId);

                if (usuarioDB.ConfirmacionEmail != false)
                {
                    return BadRequest("Usuario ya validado con anterioridad");
                }

                if (usuarioDB.EnlaceCambioPass != confirmacion.Token)
                {
                    return BadRequest("Token no valido");
                }

                await _confirmEmailService.ConfirmEmail(new DTOConfirmRegistrtion
                {
                    UserId = confirmacion.UserId
                });

                string loginUrl = _config.GetValue<string>("RedirectUrls:Login");
                //return Ok();
                return Redirect(loginUrl);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al procesar de confirmación");
                return BadRequest("En estos momentos no se ha podido validar el registro, por favor, intentelo de nuevo más tarde.");
            }
        }
        //------------------------------------------------------------------------------------------------
        //Este endpoint se encarga de hacer que el usuario se pueda loguear para que un usuario se 
        //pueda loguear este endpoint requiere un DTOLoginUsuario que contiene los datos necesarios
        //para hacer login esos datos se pasan por el body de la peticion
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult> UserLogin([FromBody] DTOLoginUsuario usuario)
        {

            try
            {
                //Al hacer login se nor pide un nombre de usuario y contraseña primero comprobamos si el
                //nombre de usuario existe.
                var usuarioDB = await _usuarioRepositoryEmailAndUsername.ObtenerUsuarioPorNombreOEmail(usuario.UserName, usuario.Email);
                //var usuarioDB = await _context.Usuarios.FirstOrDefaultAsync(x => x.UserName == usuario.UserName || x.Email == usuario.Email);
                //Si el nombre de usuario no existe devolvemos el mensaje almacenado en Unauthorized

                if (usuarioDB == null)
                {
                    return Unauthorized("Usuario no encontrado.");
                }
                //Si el usuario existe pero no ha confirmado su email devolvemos el mensaje contenido en
                //Unauthorized
                if (usuarioDB.ConfirmacionEmail != true)
                {
                    return Unauthorized("Usuario no confirmado, por favor acceda a su correo y valida su registro.");
                }
                //Si el usuario ha solicidado darse de baja de la aplicacion he intenta loguearse se le
                //avisara al usuario con el mensaje contenido en Unauthorized.
                if (usuarioDB.BajaUsuario == true)
                {
                    return Unauthorized("El usuario se encuentra dado de baja.");
                }
                //Esta variable almacena la llamada al servicio _hashService este servicio tiene un metodo
                //llamado hash al cual se le pasa la contraseña de usuario para que la cifre y se le asigna un
                //salt que corresponde a esa contraseña
                var resultadoHash = _hashService.Hash(usuario.Password, usuarioDB.Salt);
                //Se comprueba si la contraseña que intruce el usuario corresponde con el hash que tiene asociado
                //esa contraseña en base de datos.
                if (usuarioDB.Password == resultadoHash.Hash)
                {
                    //Si la contraseña es correcta se le devuelve el token al usuario

                    var response = await _tokenService.GenerarToken(usuarioDB);
                   
                    //Si todo ha ido bien se le devuelve el token

                    return Ok(response);
                }
                else
                {
                    //Si el usuario se equivoca en la contraseña se le devuelve este error

                    return Unauthorized("Contraseña incorrecta.");
                }

            }
            catch(Exception ex) 
            {
                _logger.LogError(ex, "Error al procesar de logado");
                return BadRequest("En estos momentos no se ha podido realizar el login, por favor, intentelo más tarde.");
            }

        }
        ////Este endpoint se encarga de dar de baja ha un usuario el cual necesita un DTOUserDeregistration
        ////que contiene los datos necesarios para dar de baja ese usuario.
        [HttpPut("bajaUsuario")]
        public async Task<ActionResult> UserDeregistration([FromBody] DTOUserDeregistration Id)
        {

            try
            {
                //Buscamos si el usuario existe en base de datos esta busqueda se realiza en base a su id
               // var userExist = _usuarioPorId.ObtenerUsuarioPorId(Id.Id);
                //var userExist = await _context.Usuarios.FirstOrDefaultAsync(x => x.Id == Id.Id);
                //Si se intenta dar de baja a un usuario que no existe sale el mensaje contenido en
                //Unauthorized
                var userExist = await _existUsersService.UserExistById(Id.Id);

                if (userExist == null)
                {
                    return Unauthorized("Usuario no encontrado");
                }
                //Si el usuario se intenta dar de baja nuevamente sale el mensaje contenido en Unauthorized

                if (userExist.BajaUsuario == true)
                {
                    return Unauthorized("Usuario dado de baja con anterioridad");
                }
                //Si todo va bien el usuario se da de baja correctamente, para ello se llama al servicio
                //_userDeregistrationService que tiene un metodo UserDeregistration dicho metodo necesita
                //un DTOUserDeregistration que contiene los datos necesarios para procesar la baja de usuario
                await _userDeregistrationService.UserDeregistration(new DTOUserDeregistration
                {
                    Id = Id.Id
                });
              
                //Si todo ha ido bien se devuelve un ok.

                return Ok();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error al procesar de baja");
                return BadRequest("En estos momentos no se ha podido dar de baja el usuario, por favor, intentelo más tarde.");
            }

        }
		////Este endpoint se encarga de eliminar un usuario este endpoint necesita un DTODeleteUser que contiene
		////los datos necesarios para eliminar el usuario.
		[AllowAnonymous]
        [HttpDelete("elimnarUsuario")]
        public async Task<ActionResult> DeleteUser([FromBody] DTODeleteUser Id)
        {

            try
            {
                var userExist = await _existUsersService.UserExistById(Id.Id);

                //var userExist = _usuarioPorId.ObtenerUsuarioPorId(Id.Id);
                //Buscamos en base de datos si existe el usuario en base de datos en base a su id.
                //var userExist = await _context.Usuarios.FirstOrDefaultAsync(x => x.Id == Id.Id);
                //Si el usuario no existe al administrador del sitio le sale el mensaje contenido en
                //Unauthorized.
                if (userExist == null)
                {
                    return Unauthorized("Usuario no encontrado");
                }
				//await _operationsService.AddOperacion(new DTOOperation
				//{
				//	Operacion = "Borrar usuario",
				//	UserId = userExist.Id
				//});
				//Si el usuario no se ha dado de baja no se puede eliminar por lo tanto al administrador se le
				//comunica que el usuario no se ha dado de baja por lo tanto necesita darse de baja.
				if (userExist.BajaUsuario == false)
                {
                    return Unauthorized("El usuario no se encuentra dado de baja, por favor, solicita la baja primero.");
                }
				//Para eliminar al usuario llamamos al servicio _deleteUserService el cual tiene un metodo
				//DeleteUser este metodo necesita un DTODeleteUser que contiene los datos necesarios para
				//eliminar a un usuario.
				
				await _deleteUserService.DeleteUser(new DTODeleteUser
                {
                    Id = Id.Id
                });
                //Una vez que se ha eliminado el usuario se agrega una operacion llamando al servicio
                //_operationsService que contiene un metodo AddOperacion y contiene un DTOOperation el
                //cual tiene los datos necesarios para agregar la operacion.
               

                //Si todo ha ido bien devolvemos un ok.

                return Ok();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error al procesar de eliminación de usuario");
                return BadRequest("En estos momentos no se ha podido eliminar el usuario, por favor, intentelo más tarde.");
            }

        }
        ////En este endpoint se realiza una peticion get la cual obtiene el usuario por su id, este endpoint
        ////contiene un DTOById que el dato que tiene se le pasa por ruta
      
        [HttpGet("usuarioPorId/{Id}")]
        public async Task<ActionResult> UserById([FromRoute] DTOById userData)
        {

            try
            {
                var userExist = await _existUsersService.UserExistById(userData.Id);

                //Buscamos en base de datos si el usuario existe en base a su id
               // var userExist = _usuarioPorId.ObtenerUsuarioPorId(userData.Id);
                //var userExist = await _context.Usuarios.FindAsync(userData.Id);
                //Si el usuario no existe mostramos el mensaje contenido en NotFound.
                
                if (userExist == null)
                {
                    return NotFound("Usuario no encontrado");
                }
                // Consultar todas las medicaciones del usuario
                var medicacionesUsuario = await _context.UsuarioMedicacions
                    .Include(um => um.IdMedicacionNavigation)
                    .Where(um => um.IdUsuario == userExist.Id)
                    .ToListAsync();

                // Asignar las medicaciones al usuario
                userExist.UsuarioMedicacions = medicacionesUsuario;


                // Asignar las medicaciones al usuario
                //Si todo ha ido bien devolvemos el usuario.

                return Ok(userExist);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error al obtener informacion del usuario");
                return BadRequest("En estos momentos no se ha podido consultar el usuario, por favor, intentelo más tarde.");
            }

        }
		

		
		[HttpPatch("cambiardatosusuario")]
		public async Task<ActionResult> UserPUT([FromBody] DTOChangeUserData userData)
		{

			try
			{
                //Se busca en base de datos si el usuario existe en base a su id
                //var usuarioUpdate = await _context.Usuarios.AsTracking().FirstOrDefaultAsync(x => x.Id == userData.Id);
                //var usuarioUpdate = _usuarioPorId.ObtenerUsuarioPorId(userData.Id);
                var userExist = await _existUsersService.UserExistById(userData.Id);

                //Se llama al servicio _changeUserDataService encargado de actualizar el usuario
                //dicho servicio tiene un metodo ChangeUserData el cual se le pasa un DTOChangeUserData
                //este dto contiene los datos necesarios para actualizar el usuario.
                await _changeUserDataService.ChangeUserData(new DTOChangeUserData
				{
					Id = userData.Id,
					Avatar = userData.Avatar,
					Nombre = userData.Nombre,
					PrimerApellido = userData.PrimerApellido,
					SegundoApellido = userData.SegundoApellido,
					Sexo = userData.Sexo,
					Edad = userData.Edad,
					Peso = userData.Peso,
					Altura = userData.Altura,
					Actividad = userData.Actividad,
					Medicacion = userData.Medicacion,
					TipoDiabetes = userData.TipoDiabetes,

					Insulina = userData.Insulina

				});

				//// Actualizar email del usuario
				//var usuarioActualizado = await _context.Usuarios.AsTracking().FirstOrDefaultAsync(x => x.Id == userData.Id);

				//var usuarioActualizado = _usuarioPorId.ObtenerUsuarioPorId(userData.Id);
				//if (usuarioActualizado != null && usuarioActualizado.Email != userData.Email)
				//{

				//	usuarioActualizado.ConfirmacionEmail = false;
				//	usuarioActualizado.Email = userData.Email;
				//	_context.Usuarios.Update(usuarioActualizado);
				//	await _context.SaveChangesAsync();
				//	await _emailService.SendEmailAsyncRegister(new DTOEmail
				//                {
				//                    ToEmail = userData.Email
				//                });
				//            }
				//            else
				//{
				//                usuarioUpdate.Email = userData.Email;
				//            }
				var emailActualizado = await _actualizacionYEnvioDeCorreoElectronico.ActualizarEmailUsuario(userData.Id, userData.Email);
				if (emailActualizado)
				{
					await _actualizacionYEnvioDeCorreoElectronico.EnviarCorreoElectronico(userData.Email);
				}
				else
				{
					return BadRequest("El email no puede ser el mismo si lo va a cambiar");
				}

			

				return Ok("Datos actualizados con exito");
			}
			catch(Exception ex) 
			{
                _logger.LogError(ex, "Error al procesar de eliminación actualización de usuario");
                return BadRequest("En estos momentos no se ha podido actualizar el usuario, por favor, intentelo más tarde.");
            }

		}

	
		
	}
    }

