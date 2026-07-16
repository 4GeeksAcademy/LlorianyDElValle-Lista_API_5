import { useState, useEffect } from "react";

const Home = () => {


	const [inputTarea, setInputTarea] = useState("")
	const [listaTareas, setListaTarea] = useState([])

	const user = "lory"

	const crearUsuario = async () => {

		try {

			await fetch(`https://playground.4geeks.com/todo/users/${user}`, {
				method: "POST"
			})
			await traerTareas()


		} catch (error) {
			console.log(error)

		}
	}

	const traerTareas = async () => {

		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/${user}`)
			if (!response.ok ) { 
				crearUsuario()
				 return}
			const data = await response.json()
			console.log(data)

			setListaTarea(data.todos)
		} catch (error) {
			console.log(error)
		}
	}

	const crearTareas = async () => {
		await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				label: inputTarea,
				is_done: false
			})



		})
		setInputTarea("")
		await traerTareas()
	}

	useEffect(() => {
		traerTareas()
	}, [])

	const borrarTareas = async (id) => {
		try {
			await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			})
			await traerTareas()
		} catch (error) {
			console.log(error)
		}
	}

	const limpiarTareas = async () => {
		try {
			await Promise.all(
				listaTareas.map((tarea) =>
					fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
						method: "DELETE"
					})
				)
			)
			await traerTareas()
		} catch (error) {
			console.log(error)
		}
	}


	return (

		<>
			<div className="container">
				<input className="miTarea"
					type="text"
					value={inputTarea}
					placeholder="Escribe tu nueva tarea"
					onChange={(e) => setInputTarea(e.target.value)}
					onKeyDown={(e) => {
						if (e.key == "Enter" && !e.repeat && inputTarea.trim().length > 0)
							crearTareas()
					}
					}

				>
				</input>

				<ul className="lista">
					{listaTareas.map((tarea) => {
						return (
							<li key={tarea.id} className="tarea-item">
								<span className="tarea-texto">{tarea.label}</span>
								<span className="btn-borrar" onClick={() => borrarTareas(tarea.id)}>✕</span>
							</li>
						)
					})}
				</ul>
				<div className="pendientes">
					<p>Tienes {listaTareas.length} tareas pendientes</p>
				</div>
				<button className="btn-limpiar" onClick={limpiarTareas}>
					Borrar todas
				</button>
			</div>



		</>
	)
}
export default Home;