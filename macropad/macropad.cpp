// cmd-testing.cpp : Defines the entry point for the application.
//

#include <Windows.h>
#include <fmt/core.h> 
#include <libremidi/libremidi.hpp>
#include <iostream>
#include <vector>
#include <sstream>
#include <string>

using namespace std;
using namespace libremidi;

auto display_midi_info(const libremidi::message& message) {
	fmt::print("MIDI Size: {} Content: [", message.size());
	for (size_t i = 0; i < message.size(); ++i) {
		fmt::print("{} ", message.bytes[i]);
	}
	fmt::print("] Timestamp: {}\n", message.timestamp);
}

vector<string> get_command(string rawCommand) {
	vector<string> commandParts;
	istringstream iss(rawCommand);
	string token;
	while (iss >> token) {
		commandParts.push_back(token);
	}
	return commandParts;
}

enum PadColor {
	Red,
	Green,
	Amber,
};

enum PadBrightness {
	Low,
	Medium,
	High,
};

void clear_pad(midi_out& midiO, int row, int column) {
	int index = 0x10 * row + column;
	midiO.send_message(0x90, index, 0x0);
}

void set_pad_color(midi_out& midiO, int row, int column, PadColor padColor, PadBrightness brightness, bool flash = false) {
	int index = 0x10 * row + column;
	int green = padColor == Green || padColor == Amber ? 3 : 0;
	int red = padColor == Red || padColor == Amber ? 3 : 0;
	int velocity = 0x10 * green + red;
	midiO.send_message(0x90, index, velocity);
}

int main()
{
	observer obs;
	vector<input_port> input_ports = obs.get_input_ports();
	vector<output_port> output_ports = obs.get_output_ports();

	//int i = 0;
	//for (const input_port& port : input_ports) {
	//	fmt::print("Input Port #{}: {}\n", i, port.port_name);
	//	i++;
	//}

	int i = 0;
	for (const output_port& port : output_ports) {
		fmt::print("Output Port #{}: {}\n", i, port.port_name);
		++i;
	}

	fmt::println("");
	fmt::println("Select an output port to bind: ");
	int port_index;
	cin >> port_index;
	if (port_index < 0 || port_index >= obs.get_output_ports().size()) {
		fmt::println("Invalid port index.");
		return 1;
	}

	midi_out midiO{};
	midiO.open_port(output_ports[port_index]);

	fmt::println("Type 'exit' to quit: ");

	while (true) {
		string input;
		getline(cin, input);
		if (input.empty()) continue;
		vector<string> command = get_command(input);
		if (command.empty()) {
			continue;
		}
		if (command[0] == "exit") {
			break;
		}
		if (command[0] == "send") {
			midiO.send_message(stoi(command[1], nullptr, 16), stoi(command[2], nullptr, 16), stoi(command[3], nullptr, 16));
		}
		if (command[0] == "light") {
			int row = stoi(command[1]);
			int column = stoi(command[2]);
			PadColor padColor{};
			PadBrightness padBrightness{};

			string type = command[3];
			if (type == "red") {
				padColor = Red;
			}
			else if (type == "green") {
				padColor = Green;
			}
			else if (type == "amber") {
				padColor = Amber;
			}
			else if (type == "off") {
				clear_pad(midiO, row, column);
			}
			else {
				continue;
			}

			string brightness = command[4];
			if (brightness == "low") {
				padBrightness = Low;
			}
			else if (brightness == "med") {
				padBrightness = Medium;
			}
			else if (brightness == "high") {
				padBrightness = High;
			}
			else {
				padBrightness = High;
			}

			set_pad_color(midiO, row, column, padColor, padBrightness);
		}
		if (command[0] == "clear") {
			clear_pad(midiO, stoi(command[1], nullptr, 16), stoi(command[2], nullptr, 16));
		}
	}

	return 0;
}

// For Launchpad Mini MK2 ===============
// Top Buttons:			0xB0, Key (0x68 to 0x6F),		Off/On (0x00 or 0x7F)
// Grid & Scene Launch: 0x90. Key (0x10 * Row + Column),	Off/On (0x00 or 0x7F) 
