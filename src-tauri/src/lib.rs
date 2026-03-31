use launchy::{InputDevice, OutputDevice, launchpad_mini::{Input, Output, Message}};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn initialize_launchpad() {
    let input = Input::guess(input_msg_callback);
    let mut output = Output::guess().unwrap();
    output.turn_on_all_leds(launchy::s::Brightness::Medium);
}

fn input_msg_callback(message: Message) {
    println!("Received input: {:?}", message);
}