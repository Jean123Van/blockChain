export {}
const prompt = require("prompt-sync")();
const fs = require('fs');
const crypto = require('crypto');

let command = prompt('Enter e to generate files. c for file status.: ')

if(command==='e'){
    let n=0
    do{
        let compilation = ''
        do{
            command = prompt('Enter condition: ')
            if(command==='q'){
                break
            }
            if(command!='ok'){
                if(compilation!=''){
                    compilation += '\n'
                }
                compilation += command
            }
        } while (command != 'ok')
        if(n!=0){
            const fileBuffer = fs.readFileSync(`block ${n-1}.txt`);
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            const hash = hashSum.digest('hex');
            compilation += '\n' + hash
        }
        fs.writeFileSync(`block ${n}.txt`, compilation, (error) => {
            if (error) throw error;
        })
        n++
        if(command==='q'){
            break
        }
    } while (command==='ok')
    console.log('files generated')
}

if(command==='c'){
    console.log('Block statuses: ')
    let n=0
    let values = {}
    do{ 
        try{
            var data = fs.readFileSync(`block ${n}.txt`, 'utf8');
            data = data.replace(/ /g, '')
            data = data.replace(/->/g, ',')
            data = data.split('\n').map(a=> {return a.split(',')})

            const fileBuffer = fs.readFileSync(`block ${n}.txt`);
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            const hash = hashSum.digest('hex');

            try{
                var checking = fs.readFileSync(`block ${n+1}.txt`, 'utf8');
            } catch {
                var checking = hash
            }
            checking = checking.split('\n')

            if(hash!=checking[checking.length-1]){
                console.log(`block ${n} - tampered`)
                n++
                break
            } else {
                console.log(`block ${n} - ok`)
                n++
                data.map(a=>{
                    switch(a.length){
                        case 2:
                            values[a[0]] = Number(a[1])
                        break;
                        case 3:
                            values[a[0]] -= Number(a[2])
                            values[a[1]] += Number(a[2])
                        break;
                    }
                })
            }
        } catch {
            break
        }
    } while (true)

    do{
        try {
            var tampered = fs.readFileSync(`block ${n}.txt`, 'utf8');
            console.log(`block ${n} - tampered`)
            n++
        } catch {
            break
        }
    } while (true)

    let formattedValues = Object.entries(values).join('\n')
    console.log('\n'+'Account Balances: \n'+formattedValues)
}
