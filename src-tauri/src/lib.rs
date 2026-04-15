use std::{vec};
use std::sync::Mutex;
use launchy::mini::Message;
use launchy::{InputDevice, InputDeviceHandler, OutputDevice};
use tauri::{State};
use launchy::{launchpad_mini::{Button, Color, Input, Output}};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(LaunchpadState::new())
        .invoke_handler(tauri::generate_handler![connect_launchpad, disconnect_launchpad, is_connected, light_grid_pad, light_control_pad])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

struct LaunchpadState{
    output: Mutex<Option<Output>>,
    input: Mutex<Option<InputDeviceHandler>>,
}

impl LaunchpadState {
    pub fn new() -> Self {
        Self {
            output: Mutex::new(None),
            input: Mutex::new(None),
        }
    }
}

#[tauri::command]
fn connect_launchpad(state: State<'_, LaunchpadState>) -> Result<(), String> {
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    let mut input_guard = state.input.lock().map_err(|e| e.to_string())?;

    // Connected to launchpad already
    if output_guard.is_some() {
        return Ok(());
    }

    let output = Output::guess().map_err(|e| e.to_string())?;
    let input = Input::guess(input_callback).map_err(|e| e.to_string())?;

    *output_guard = Some(output);
    *input_guard = Some(input);
    
    Ok(())
}

#[tauri::command]
fn disconnect_launchpad(state: State<'_, LaunchpadState>) -> Result<(), String> {
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    let mut input_guard = state.input.lock().map_err(|e| e.to_string())?;

    *output_guard = None;
    *input_guard = None;

    Ok(())
}

#[tauri::command]
fn is_connected(state: State<'_, LaunchpadState>) -> bool {
    let output_guard = state.output.lock().unwrap();
    output_guard.is_some()
}

fn input_callback(message: Message) {
    match message {
        Message::Press { button } => {
            println!("Button pressed: {:?}", button);
        },
        Message::Release { button } => {
            println!("Button released: {:?}", button);
        },
        _ => {}
    }
}

#[tauri::command]
fn light_grid_pad(x: u8, y: u8, color: &str, state: State<'_, LaunchpadState>) -> Result<(), String> {
    let color = string_to_color(&color).map_err(|e| e.to_string())?;
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    if let Some(output) = output_guard.as_mut() {
        output.light(Button::GridButton { x, y }, color).map_err(|e| e.to_string())?;
    } else {
        return Err("Not connected to launchpad".to_string());
    }
  Ok(())
}

#[tauri::command]
fn light_control_pad(index: u8, color: &str, state: State<'_, LaunchpadState>) -> Result<(), String> {
    let color = string_to_color(&color).map_err(|e| e.to_string())?;
    let mut output_guard = state.output.lock().map_err(|e| e.to_string())?;
    if let Some(output) = output_guard.as_mut() {
        output.light(Button::ControlButton { index }, color).map_err(|e| e.to_string())?;
    } else {
        return Err("Not connected to launchpad".to_string());
    }
  Ok(())
}

fn string_to_color(color_str: &str) -> Result<Color, &str> {
    match color_str {
        "off" => Ok(Color::OFF),
        "red" => Ok(Color::RED),
        "green" => Ok(Color::GREEN),
        "amber" => Ok(Color::AMBER),
        "dim_green" => Ok(Color::DIM_GREEN),
        "dim_red" => Ok(Color::DIM_RED),
        "orange" => Ok(Color::ORANGE),
        "yellow" => Ok(Color::YELLOW),
        _ => Err("Invalid color string!")
    } 
}